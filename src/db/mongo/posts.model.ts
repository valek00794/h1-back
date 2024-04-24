import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { PostType } from '../../types/posts-types'

export const PostsSchema = new mongoose.Schema<PostType>({
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, required: true },
})

export const PostsModel = mongoose.model<PostType>(SETTINGS.DB.collection.POSTS, PostsSchema)