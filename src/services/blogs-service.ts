import { ObjectId } from 'mongodb'

import { BlogType, BlogViewType } from '../types/blogs-types'
import { blogsRepository } from '../repositories/blogs-repository'
import { blogsQueryRepository } from '../repositories/blogs-query-repository'

export const blogsService = {
    async createBlog(body: BlogType): Promise<BlogViewType> {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return blogsQueryRepository.mapToOutput(createdBlog)
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
        const res = await blogsRepository.updateBlog(updatedblog, id)
        if (res.modifiedCount === 0) {
            return false
        }
        return true
    },

    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const res = await blogsRepository.deleteBlog(id)
        if (res.deletedCount === 0) {
            return false
        }
        return true
    },
}