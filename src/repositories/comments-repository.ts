import { injectable } from 'inversify';

import { CommentDbType, Comment } from '../types/comments-types'
import { CommentsModel } from '../db/mongo/comments.model'

@injectable()
export class CommentsRepository {
    async createComment(newComment: Comment): Promise<CommentDbType> {
        const comment = new CommentsModel(newComment)
        await comment.save()
        return comment
    }

    async updateComment(updatedComment: Comment, commentId: string): Promise<boolean> {
        const updatedResult = await CommentsModel.findByIdAndUpdate(commentId, updatedComment, { new: true })
        return updatedResult ? true : false
    }

    async deleteComment(id: string): Promise<boolean> {
        const deleteResult = await CommentsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    }

    async findComment(id: string): Promise<CommentDbType | null> {
        return await CommentsModel.findById(id)
    }
}