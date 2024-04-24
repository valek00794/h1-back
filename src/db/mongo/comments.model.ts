import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { CommentType } from '../../types/comments-types'

export const CommentsSchema = new mongoose.Schema<CommentType>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
        email: { type: String, required: false },
    },
    createdAt: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: false },
})

export const CommentsModel = mongoose.model<CommentType>(SETTINGS.DB.collection.COMMENTS, CommentsSchema)