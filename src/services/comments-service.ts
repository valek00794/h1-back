import { ObjectId } from "mongodb"

import { CommentInputType, CommentType, CommentViewType } from "../types/comments-types"
import { CommentatorInfoType } from "../types/users-types"
import { commentsRepository } from "../repositories/comments-repository"
import { commentsQueryRepository } from "../repositories/comments-query-repository"

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
}