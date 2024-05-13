import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { LikesInfo } from '../../types/likes-types'

export const LikeStatusSchema = new mongoose.Schema<LikesInfo>({
    parrentId: { type: Schema.Types.ObjectId, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true },
    authorLogin: { type: String, required: true },
    status: { type: String, required: true },
    addedAt: { type: Date, required: true },
})

export const LikeStatusModel = mongoose.model<LikesInfo>(SETTINGS.DB.collection.LIKE_STATUS, LikeStatusSchema)