import { CommentDbType, Comment } from '../types/comments-types'
import { CommentsModel } from '../db/mongo/comments.model'
import { LikesInfo } from '../types/likes-types'
import { CommentLikesStatusModel } from '../db/mongo/commentLikesStatus-model'

class CommentsRepository {
    async createComment(newComment: Comment): Promise<CommentDbType> {
        const comment = new CommentsModel(newComment)
        const commentLikesInfo = new CommentLikesStatusModel({
            commentId: comment._id,
            postId: comment.postId,
            likesCount: [],
            dislikesCount: []
        })
        await comment.save()
        await commentLikesInfo.save()
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

    async likeComment(commentId: string, userId: string): Promise<LikesInfo | null> {
        await this.removeLikeStatusComment(commentId, userId)
        return await CommentLikesStatusModel.findOneAndUpdate(
            { commentId },
            { $addToSet: { likesUsersIds: userId } },
            { new: true }
        )
    }

    async dislikeComment(commentId: string, userId: string): Promise<LikesInfo | null> {
        await this.removeLikeStatusComment(commentId, userId)
        return await CommentLikesStatusModel.findOneAndUpdate(
            { commentId },
            { $addToSet: { dislikesUsersIds: userId } },
            { new: true }
        )
    }

    async removeLikeStatusComment(commentId: string, userId: string): Promise<LikesInfo | null> {
        return await CommentLikesStatusModel.findOneAndUpdate(
            { commentId },
            {
                $pull: { likesUsersIds: userId, dislikesUsersIds: userId }
            },
            { new: true }
        )
    }
}

export const commentsRepository = new CommentsRepository()