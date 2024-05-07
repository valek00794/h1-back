import { Request, Response } from 'express'

import { Comment } from '../types/comments-types';
import { commentsQueryRepository } from '../repositories/comments-query-repository';
import { postsQueryRepository } from '../repositories/posts-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { commentsService } from '../services/comments-service';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';

class CommentsController {
    async findCommentController(req: Request, res: Response<false | Comment>) {
        const comment = await commentsQueryRepository.findComment(req.params.id, req.user?.userId!)
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
        const commentatorInfo = {
            userId: req.user?.userId!,
            userLogin: req.user?.login!
        }
        const comment = await commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
            comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
            res
                .status(StatusCodes.FORBIDDEN_403)
                .send()
            return
        }

        await commentsService.deleteComment(req.params.commentId)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }

    async createCommentForPostController(req: Request, res: Response<Comment>) {
        if (!req.user || !req.user.userId) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const post = await postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const commentatorInfo = {
            userId: req.user?.userId!,
            userLogin: req.user?.login!
        }
        const createdComment = await commentsService.createComment(req.body, commentatorInfo, req.params.postId)
        const comment = commentsQueryRepository.mapToOutput(createdComment)
        res
            .status(StatusCodes.CREATED_201)
            .send(comment)
    }

    async updateCommentForPostController(req: Request, res: Response<Comment>) {
        if (!req.user || !req.user.userId) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const comment = await commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const commentatorInfo = {
            userId: req.user?.userId!,
            userLogin: req.user?.login!
        }
        if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
            comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
            res
                .status(StatusCodes.FORBIDDEN_403)
                .send()
            return
        }
        await commentsService.updateComment(req.body, comment)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }

    async getCommentsForPostController(req: Request, res: Response<Paginator<Comment[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const post = await postsQueryRepository.findPost(req.params.postId)
        if (!post) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const comments = await commentsQueryRepository.getComments(req.params.postId, query, req.user?.userId!)
        res
            .status(StatusCodes.OK_200)
            .send(comments)
    }

    async changeCommentLikeStatusController(req: Request, res: Response<Paginator<Comment[]>>) {
        if (!req.user || !req.user.userId) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const comment = await commentsQueryRepository.findComment(req.params.commentId)
        if (!comment) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        await commentsService.changeCommentLikeStatus(req.params.commentId, req.body.likeStatus, req.user.userId)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }
}

export const commentsController = new CommentsController()