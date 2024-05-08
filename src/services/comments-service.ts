import { ObjectId } from "mongodb"

import { CommentDbType, CommentInputType, Comment, CommentView } from "../types/comments-types"
import { CommentatorInfoType } from "../types/users-types"
import { LikeStatus } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"
import { CommentsRepository } from "../repositories/comments-repository"

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository) { }
    async createComment(body: CommentInputType, commentatorInfo: CommentatorInfoType, postId?: string): Promise<CommentDbType> {
        const newComment = new Comment(
            body.content,
            {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            },
            new Date().toISOString(),
            new ObjectId(postId),
        )
        return await this.commentsRepository.createComment(newComment)
    }

    async updateComment(body: CommentInputType, comment: CommentView): Promise<boolean> {
        const updatedComment = new Comment(
            body.content,
            {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            comment.createdAt,
            comment.postId,

        )
        return await this.commentsRepository.updateComment(updatedComment, comment.id.toString())
    }

    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await this.commentsRepository.deleteComment(id)
    }

    async changeCommentLikeStatus(commentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<null>> {
        if (likeStatus === LikeStatus.Like) {
            await this.commentsRepository.likeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.Dislike) {
            await this.commentsRepository.dislikeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.None) {
            await this.commentsRepository.removeLikeStatusComment(commentId, userId)
        }

        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}