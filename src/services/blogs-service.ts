import { ObjectId } from 'mongodb'

import { BlogDbType, Blog } from '../types/blogs-types'
import { blogsRepository } from '../repositories/blogs-repository'

class BlogsService {
    async createBlog(body: Blog): Promise<BlogDbType> {
        const newBlog= new Blog(
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
            false
        )
        return await blogsRepository.createBlog(newBlog)
    }

    async updateBlog(body: Blog, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsRepository.findBlog(id)
        const updatedblog = new Blog(
            body.name,
            body.description,
            body.websiteUrl,
            blog!.createdAt,
            false,
        )
        return await blogsRepository.updateBlog(updatedblog, id)
    }

    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await blogsRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsService()