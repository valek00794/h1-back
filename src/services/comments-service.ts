import { ObjectId } from "mongodb"

import { CommentDbType, CommentInputType, Comment, CommentView } from "../types/comments-types"
import { CommentatorInfoType } from "../types/users-types"
import { commentsRepository } from "../repositories/comments-repository"
import { LikeStatus } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"

class CommentsService {
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
        return await commentsRepository.createComment(newComment)
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
        return await commentsRepository.updateComment(updatedComment, comment.id.toString())
    }

    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await commentsRepository.deleteComment(id)
    }

    async changeCommentLikeStatus(commentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<null>> {
        if (likeStatus === LikeStatus.Like) {
            await commentsRepository.likeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.Dislike) {
            await commentsRepository.dislikeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.None) {
            await commentsRepository.removeLikeStatusComment(commentId, userId)
        }

        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}

export const commentsService = new CommentsService()