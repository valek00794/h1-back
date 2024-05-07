import { ObjectId } from 'mongodb'

import { BlogDbType, BlogType } from '../types/blogs-types'
import { blogsRepository } from '../repositories/blogs-repository'

export const blogsService = {
    async createBlog(body: BlogType): Promise<BlogDbType> {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createBlog(newBlog)
    },

    async updateBlog(body: BlogType, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsRepository.findBlog(id)
        const updatedblog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: blog!.createdAt,
            isMembership: false,
        }
        return await blogsRepository.updateBlog(updatedblog, id)
    },

    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await blogsRepository.deleteBlog(id)
    },
}