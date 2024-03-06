import { ObjectId } from 'mongodb'
import { blogsCollection } from '../db/db'
import { BlogType } from '../types/blogs-types'

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return await blogsCollection.find({}).toArray()
    },
    async findBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return await blogsCollection.findOne({ "_id": new ObjectId(id) })
        } else {
            return false
        }
    },
    async deleteBlog(id: string) {
        const blog = await blogsCollection.deleteOne({ "_id": new ObjectId(id) })
        if (blog.deletedCount === 0) {
            return false
        } else {
            return true
        }
    },
    async createBlog(body: BlogType) {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }

        const blogInsertId = (await blogsCollection.insertOne(newBlog)).insertedId
        return await this.findBlog(blogInsertId.toString())
    },
    async updateBlog(body: BlogType, id: string) {
        const blog = await this.findBlog(id)
        if (!blog) {
            return false
        } else {
            const updatedblog: BlogType = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }
            await blogsCollection.updateOne({ "_id": new ObjectId(id) }, { "$set": updatedblog })
            return true
        }
    }
}