import { ObjectId } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogType, BlogViewType } from '../types/blogs-types'
import { blogsQueryRepository } from './blogs-query-repository'

export const blogsRepository = {
    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        if (blog.deletedCount === 0) {
            return false
        }
        return true
    },
    async createBlog(body: BlogType): Promise<BlogViewType> {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)
        return blogsQueryRepository.mapToOutput(newBlog) //обычный repo не должен мапить данные
    },
    async updateBlog(body: BlogType, id: string): Promise<boolean> {
        const blog = await blogsQueryRepository.findBlog(id)
        if (!blog) {
            return false
        }
        const updatedblog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false,
        }
        await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedblog })
        return true
    },
}