import { ObjectId } from 'mongodb'

import { commentsCollection } from '../db/db'
import { CommentDbType, CommentInputType, CommentViewType } from '../types/comments-types'
import { UserInfo } from '../types/users-types'
import { commentsQueryRepository } from './comments-query-repository'

export const commentsRepository = {
    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
        if (comment.deletedCount === 0) {
            return false
        }
        return true
    },

    async createComment(body: CommentInputType, commentatorInfo: UserInfo, postId?: string): Promise<CommentViewType> {
        const newComment: CommentDbType = {
            content: body.content,
            postId: new ObjectId(postId),
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            }
        }
        await commentsCollection.insertOne(newComment)
        return commentsQueryRepository.mapToOutput(newComment) //обычный repo не должен мапить данные
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
        await commentsCollection.updateOne({ _id: comment.id }, { $set: updatedComment })
        return true
    },

}