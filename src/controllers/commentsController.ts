import { Request, Response } from 'express'
import { injectable } from 'inversify';

import { Comment } from '../types/comments-types';
import { SearchQueryParametersType } from '../types/query-types';
import { ResultStatus, StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';
import { CommentsService } from '../services/comments-service';
import { CommentsQueryRepository } from '../repositories/comments-query-repository';
import { PostsQueryRepository } from '../repositories/posts-query-repository';
import { LikesService } from '../services/likes-service';

@injectable()
export class CommentsController {
    constructor(
        protected commentsService: CommentsService,
        protected likesService: LikesService,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected postsQueryRepository: PostsQueryRepository
    ) { }

    async findCommentController(req: Request, res: Response<false | Comment>) {
        const comment = await this.commentsQueryRepository.findComment(req.params.id, req.user?.userId!)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        res
            .status(StatusCodes.OK_200)
            .json(comment)
    }

    async deleteCommentController(req: Request, res: Response<boolean>) {
        const comment = await this.commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const deleteResult = await this.commentsService.deleteComment(comment, req.user?.userId!, req.user?.login!)
        if (deleteResult.status === ResultStatus.Forbidden) {
            res
                .status(StatusCodes.FORBIDDEN_403)
                .send()
            return
        }
        if (deleteResult.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .send()
            return
        }
    }

    async createCommentForPostController(req: Request, res: Response<Comment>) {
        const post = await this.postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
        }
        const createdResult = await this.commentsService.createComment(req.body, req.params.postId, req.user?.userId!, req.user?.login!)
        const comment = this.commentsQueryRepository.mapToOutput(createdResult.data!)
        res
            .status(StatusCodes.CREATED_201)
            .send(comment)
        return
    }

    async updateCommentForPostController(req: Request, res: Response<Comment>) {
        const comment = await this.commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const updateResult = await this.commentsService.updateComment(req.body, comment, req.user?.userId!, req.user?.login!)
        if (updateResult.status === ResultStatus.Forbidden) {
            res
                .status(StatusCodes.FORBIDDEN_403)
                .send()
            return
        }
        if (updateResult.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .send()
            return
        }
    }

    async getCommentsForPostController(req: Request, res: Response<Paginator<Comment[]>>) {
        const post = await this.postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const query = req.query as unknown as SearchQueryParametersType;
        const comments = await this.commentsQueryRepository.getComments(req.params.postId, query, req.user?.userId!)
        res
            .status(StatusCodes.OK_200)
            .send(comments)
    }

    async changeCommentLikeStatusController(req: Request, res: Response<Paginator<Comment[]>>) {
        const comment = await this.commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        await this.likesService.changeLikeStatus(req.params.commentId, req.body.likeStatus, req.user!.userId, req.user!.login)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }
}

