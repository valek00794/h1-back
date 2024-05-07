import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { Post } from '../../types/posts-types'

export const PostsSchema = new mongoose.Schema<Post>({
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, required: true },
})

export const PostsModel = mongoose.model<Post>(SETTINGS.DB.collection.POSTS, PostsSchema)