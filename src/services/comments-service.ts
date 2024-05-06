import { ObjectId } from "mongodb"

import { CommentInputType, CommentType, CommentViewType } from "../types/comments-types"
import { CommentatorInfoType } from "../types/users-types"
import { commentsRepository } from "../repositories/comments-repository"
import { commentsQueryRepository } from "../repositories/comments-query-repository"
import { LikeStatus } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"

export const commentsService = {
    async createComment(body: CommentInputType, commentatorInfo: CommentatorInfoType, postId?: string): Promise<CommentViewType> {
        const newComment: CommentType = {
            content: body.content,
            postId: new ObjectId(postId),
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            }
        }
        const createdComment = await commentsRepository.createComment(newComment)
        return commentsQueryRepository.mapToOutput(createdComment)
    },

    async updateComment(body: CommentInputType, comment: CommentViewType): Promise<boolean> {
        const updatedComment: CommentType = {
            content: body.content,
            postId: comment.postId,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            }
        }
        return await commentsRepository.updateComment(updatedComment, comment.id.toString())
    },

    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await commentsRepository.deleteComment(id)
    },

    async changeCommentLikeStatus(commentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<null>> {
        const comment = await commentsQueryRepository.findComment(commentId)
        if (!comment)
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        if (likeStatus === LikeStatus.Like) {
            await commentsRepository.likeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.Dislike) {
            await commentsRepository.dislikeComment(commentId, userId)
        }
        if (likeStatus === LikeStatus.None) {
            await commentsRepository.removeLikeStatusComment(commentId, userId)
        }

        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
}