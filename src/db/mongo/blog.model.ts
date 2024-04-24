import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { BlogType } from '../../types/blogs-types'

export const BlogsSchema = new mongoose.Schema<BlogType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})
export const BlogModel = mongoose.model<BlogType>(SETTINGS.DB.collection.BLOGS, BlogsSchema)