import { ObjectId } from 'mongodb'
import { blogsCollection, postsCollection } from '../db/db'
import { BlogDBType, BlogType, BlogViewType } from '../types/blogs-types'
import { postsRepository } from './posts-repository'

export const blogsRepository = {
    async getBlogs(): Promise<BlogViewType[]> {
        const blogs = await blogsCollection.find({}).toArray()
        return blogs.map(blog => this.mapToOutput(blog))
    },
    async findBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const blog = await blogsCollection.findOne({ "_id": new ObjectId(id) })
            if (blog === null) {
                return false
            } else {
                return this.mapToOutput(blog!)
            }
        } else {
            return false
        }
    },
    async findPostsOfBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const posts = await postsCollection.find({ "blogId": new ObjectId(id) }).toArray()
            return posts.map(post => postsRepository.mapToOutput(post))
        } else {
            return false
        }
    },
    async deleteBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const blog = await blogsCollection.deleteOne({ "_id": new ObjectId(id) })
            if (blog.deletedCount === 0) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    },
    async createBlog(body: BlogType) {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
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
                createdAt: blog.createdAt,
                isMembership: false,
            }
            await blogsCollection.updateOne({ "_id": new ObjectId(id) }, { "$set": updatedblog })
            return true
        }
    },
    mapToOutput(blog: BlogDBType) {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    }
}