import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { LikesInfo } from '../../types/likes-types'

export const CommentLikesStatusSchema = new mongoose.Schema<LikesInfo>({
    parrentId: { type: Schema.Types.ObjectId, required: true },
    likesUsersIds: { type: [String], required: true },
    dislikesUsersIds: { type: [String], required: true },

})

export const PostLikesStatusModel = mongoose.model<LikesInfo>(SETTINGS.DB.collection.LIKE_STATUS, CommentLikesStatusSchema)