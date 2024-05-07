import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { LikesInfo } from '../../types/likes-types'

export const CommentLikesStatusSchema = new mongoose.Schema<LikesInfo>({
    commentId: { type: Schema.Types.ObjectId, required: false },
    likesUsersIds: { type: [String], required: true },
    dislikesUsersIds: { type: [String], required: true },
})

export const CommentLikesStatusModel = mongoose.model<LikesInfo>(SETTINGS.DB.collection.COMMENTS_LIKE_STATUS, CommentLikesStatusSchema)