import { DeleteResult, ObjectId, UpdateResult } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogType, BlogViewType } from '../types/blogs-types'

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogViewType> {
        await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(updatedblog: BlogType, id: string): Promise<UpdateResult<BlogType>> {
        return await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedblog })
    },
    async deleteBlog(id: string): Promise<DeleteResult> {
        return await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    },
}