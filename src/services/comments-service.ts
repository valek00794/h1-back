import { ObjectId } from "mongodb"

import { CommentDbType, CommentInputType, Comment, CommentView } from "../types/comments-types"
import { CommentatorInfo } from "../types/users-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"
import { CommentsRepository } from "../repositories/comments-repository"
import { PostsRepository } from "../repositories/posts-repository"
import { LikesRepository } from "../repositories/likes-repository"

export class CommentsService {
    constructor(
        protected commentsRepository: CommentsRepository,
        protected postsRepository: PostsRepository,
    ) { }

    async createComment(body: CommentInputType, postId: string, userId: string, userLogin: string): Promise<Result<CommentDbType>> {
        const commentatorInfo = new CommentatorInfo(
            userId,
            userLogin
        )
        const newComment = new Comment(
            body.content,
            {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            },
            new Date().toISOString(),
            new ObjectId(postId),
        )
        const comment = await this.commentsRepository.createComment(newComment)
        return new Result<CommentDbType>(
            ResultStatus.Created,
            comment,
            null
        )
    }

    async updateComment(body: CommentInputType, comment: CommentView, userId: string, userLogin: string): Promise<Result<null>> {
        const commentatorInfo = new CommentatorInfo(
            userId,
            userLogin
        )
        if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
            comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
            return new Result<null>(
                ResultStatus.Forbidden,
                null,
                null
            )
        }
        const updatedComment = new Comment(
            body.content,
            {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            comment.createdAt,
            comment.postId,

        )
        await this.commentsRepository.updateComment(updatedComment, comment.id.toString())
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async deleteComment(comment: CommentView, userId: string, userLogin: string): Promise<Result<null>> {
        const commentatorInfo = new CommentatorInfo(
            userId,
            userLogin
        )
        if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
            comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
            return new Result<null>(
                ResultStatus.Forbidden,
                null,
                null
            )
        }
        await this.commentsRepository.deleteComment(comment.id.toString())
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}