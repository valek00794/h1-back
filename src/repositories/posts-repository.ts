import { ObjectId } from 'mongodb'
import { postsCollection } from '../db/db'
import { CreatePostType, PostDbType, PostType, PostViewType } from '../types/posts-types'
import { blogsRepository } from './blogs-repository'

export const postsRepository = {
    async getPosts(): Promise<PostViewType[]> {
        const posts = await postsCollection.find({}).toArray()
        return posts.map(post => this.mapToOutput(post))
    },
    async findPost(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const post = await postsCollection.findOne({ "_id": new ObjectId(id) })
            if (!post) {
                return false
            } else {
                return this.mapToOutput(post!)
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

    async deletePost(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const post = await postsCollection.deleteOne({ "_id": new ObjectId(id) })
            if (post.deletedCount === 0) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    },
    async createPost(body: CreatePostType) {
        const newPost: PostType = {
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
            const updatedPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: new ObjectId(body.blogId),
                blogName: '',
                createdAt: post.createdAt
            }
            const blog = await blogsRepository.findBlog(body.blogId.toString())
            if (blog) {
                updatedPost.blogName = blog.name
            }
            await postsCollection.updateOne({ "_id": new ObjectId(id) }, { "$set": updatedPost })
            return true
        }
    },
    mapToOutput(post: PostDbType) {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}