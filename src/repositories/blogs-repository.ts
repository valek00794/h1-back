import { BlogType, BlogViewType } from '../types/blogs-types'
import { BlogModel } from '../db/mongo/blog.model'

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogViewType> {
        const blog = new BlogModel(newBlog)
        await blog.save()
        return blog
    },
    async updateBlog(updatedblog: BlogType, id: string): Promise<BlogType | null> {
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, updatedblog, { new: true })
        return updatedBlog
    },
    async deleteBlog(id: string): Promise<null> {
        return await BlogModel.findByIdAndDelete(id)
    },
}