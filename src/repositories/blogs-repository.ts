import { BlogDbType, Blog } from '../types/blogs-types'
import { BlogsModel } from '../db/mongo/blogs.model'

export class BlogsRepository {
    async createBlog(newBlog: Blog): Promise<BlogDbType> {
        const blog = new BlogsModel(newBlog)
        await blog.save()
        return blog
    }

    async updateBlog(updatedBlog: Blog, id: string): Promise<boolean> {
        const updatedResult = await BlogsModel.findByIdAndUpdate(id, updatedBlog, { new: true })
        return updatedResult ? true : false
    }

    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await BlogsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    }

    async findBlog(id: string): Promise<Blog | null> {
        return await BlogsModel.findById(id)
    }
}

