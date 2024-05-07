import { BlogDbType, BlogType } from '../types/blogs-types'
import { BlogsModel } from '../db/mongo/blogs.model'

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogDbType> {
        const blog = new BlogsModel(newBlog)
        await blog.save()
        return blog
    },
    async updateBlog(updatedBlog: BlogType, id: string): Promise<boolean> {
        const updatedResult = await BlogsModel.findByIdAndUpdate(id, updatedBlog, { new: true })
        return updatedResult ? true : false
    },
    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await BlogsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
    async findBlog(id: string): Promise<BlogType | null> {
        return await BlogsModel.findById(id)
    },
}