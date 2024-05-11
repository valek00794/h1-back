import { ObjectId } from 'mongodb'

import { BlogDbType, Blog } from '../types/blogs-types'
import { BlogsRepository } from '../repositories/blogs-repository'

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) { }

    async createBlog(body: Blog): Promise<BlogDbType> {
        const newBlog = new Blog(
            body.name,
            body.description,
            body.websiteUrl,
            new Date().toISOString(),
            false
        )
        return await this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog(body: Blog, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await this.blogsRepository.findBlog(id)
        if (!blog) {
            return false
        }
        const updatedblog = new Blog(
            body.name,
            body.description,
            body.websiteUrl,
            blog!.createdAt,
            false,
        )
        return await this.blogsRepository.updateBlog(updatedblog, id)
    }

    async deleteBlog(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await this.blogsRepository.deleteBlog(id)
    }
}
