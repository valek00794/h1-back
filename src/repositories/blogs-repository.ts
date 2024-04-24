import { BlogType } from '../types/blogs-types'
import { BlogModel } from '../db/mongo/blog.model'
import { WithId } from 'mongodb'

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<WithId<BlogType>> {
        const blog = new BlogModel(newBlog)
        await blog.save()
        return blog
    },
    async updateBlog(updatedblog: BlogType, id: string): Promise<BlogType | null> {
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, updatedblog, { new: true })
        return updatedBlog
    },
    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await BlogModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
}