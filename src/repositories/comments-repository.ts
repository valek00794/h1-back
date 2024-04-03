import { DeleteResult, ObjectId, UpdateResult } from 'mongodb'

import { commentsCollection } from '../db/db'
import { CommentDbType, CommentType } from '../types/comments-types'

export const commentsRepository = {
    async createComment(newComment: CommentDbType): Promise<CommentDbType> {
        await commentsCollection.insertOne(newComment)
        return newComment
    },
    async updateComment(updatedComment: CommentDbType, commentId: string): Promise<UpdateResult<CommentType>> {
        return await commentsCollection.updateOne({ _id: new ObjectId(commentId) }, { $set: updatedComment })
    },
    async deleteComment(id: string): Promise<DeleteResult> {
        return await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    },
}