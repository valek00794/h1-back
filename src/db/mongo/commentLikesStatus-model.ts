import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { LikesInfoType } from '../../types/likes-types'

export const CommentLikesStatusSchema = new mongoose.Schema<LikesInfoType>({
    commentId: { type: Schema.Types.ObjectId, required: false },
    likesUsersIds: { type: [String], required: true },
    dislikesUsersIds: { type: [String], required: true },
})

export const CommentLikesStatusModel = mongoose.model<LikesInfoType>(SETTINGS.DB.collection.COMMENTS_LIKE_STATUS, CommentLikesStatusSchema)