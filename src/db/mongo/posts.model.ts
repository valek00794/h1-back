import mongoose, { Schema } from 'mongoose'

import { SETTINGS } from '../../settings'
import { PostType } from '../../types/posts-types'

export const PostsSchema = new mongoose.Schema<PostType>({
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: Schema.Types.ObjectId, require: true },
})
export const PostsModel = mongoose.model<PostType>(SETTINGS.DB.collection.POSTS, PostsSchema)