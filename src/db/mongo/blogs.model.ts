import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { Blog } from '../../types/blogs-types'

export const BlogsSchema = new mongoose.Schema<Blog>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})

export const BlogsModel = mongoose.model<Blog>(SETTINGS.DB.collection.BLOGS, BlogsSchema)