import { WithId } from 'mongodb'

import { CommentType } from '../types/comments-types'
import { CommentsModel } from '../db/mongo/comments.model'

export const commentsRepository = {
    async createComment(newComment: CommentType): Promise<WithId<CommentType>> {
        const comment = new CommentsModel(newComment)
        await comment.save()
        return comment
    },
    async updateComment(updatedComment: CommentType, commentId: string): Promise<boolean> {
        const updatedResult = await CommentsModel.findByIdAndUpdate(commentId, updatedComment, { new: true })
        return updatedResult ? true : false
    },
    async deleteComment(id: string): Promise<boolean> {
        const deleteResult = await CommentsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
}