import { ObjectId } from "mongodb"

import { CommentDbType, CommentInputType, CommentViewType } from "../types/comments-types"
import { CommentatorInfoType } from "../types/users-types"
import { commentsRepository } from "../repositories/comments-repository"
import { commentsQueryRepository } from "../repositories/comments-query-repository"

export const commentsService = {
    async createComment(body: CommentInputType, commentatorInfo: CommentatorInfoType, postId?: string): Promise<CommentViewType> {
        const newComment: CommentDbType = {
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
        const updatedComment: CommentDbType = {
            content: body.content,
            postId: comment.postId,
            createdAt: comment.createdAt,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            }
        }
        const res = await commentsRepository.updateComment(updatedComment, comment.id.toString())
        if (res.modifiedCount === 0) {
            return false
        }
        return true
    },

    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const res = await commentsRepository.deleteComment(id)
        if (res.deletedCount === 0) {
            return false
        }
        return true
    },
}