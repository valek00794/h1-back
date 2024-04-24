import mongoose from 'mongoose'
import { SETTINGS } from '../../settings'
import { BlogType } from '../../types/blogs-types'

export const BlogSchema = new mongoose.Schema<BlogType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel = mongoose.model<BlogType>(SETTINGS.DB.collection.BLOGS, BlogSchema)