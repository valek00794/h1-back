import { ObjectId } from 'mongodb'
import { postsCollection } from '../db/db'
import { CreatePostType, OutputPostType } from '../types/posts-types'
import { blogsRepository } from './blogs-repository'

export const postsRepository = {
    async getPosts(): Promise<OutputPostType[]> {
        return await postsCollection.find({}).toArray()
    },
    async findPost(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return postsCollection.findOne({ "_id": new ObjectId(id) })
        } else {
            return false
        }
    },
    async deletePost(id: string) {
        const post = await postsCollection.deleteOne({ "_id": new ObjectId(id) })
        if (post.deletedCount === 0) {
            return false
        } else {
            return true
        }
    },
    async createPost(body: CreatePostType) {
        const newPost: OutputPostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(body.blogId),
            blogName: '',
            createdAt: new Date().toISOString()
        }
        const blog = await blogsRepository.findBlog(body.blogId)
        if (blog) {
            newPost.blogName = blog.name
        }
        const postInsertId = (await postsCollection.insertOne(newPost)).insertedId
        return await this.findPost(postInsertId.toString())
    },
    async updatePost(body: CreatePostType, id: string) {
        const post = await this.findPost(id)
        if (!post) {
            return false
        } else {
            const updatedPost: OutputPostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: new ObjectId(body.blogId),
                blogName: '',
                createdAt: new Date().toISOString()
            }
            const blog = await blogsRepository.findBlog(body.blogId)
            if (blog) {
                updatedPost.blogName = blog.name
            }
            await postsCollection.updateOne({ "_id": new ObjectId(id) }, { "$set": updatedPost })
            return true
        }
    }
}