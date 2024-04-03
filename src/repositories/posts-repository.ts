import { ObjectId } from 'mongodb'

import { postsCollection } from '../db/db'
import { CreatePostType, PostType, PostViewType } from '../types/posts-types'
import { blogsQueryRepository } from './blogs-query-repository'
import { postsQueryRepository } from './posts-query-repository'

export const postsRepository = {
    async deletePost(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await postsCollection.deleteOne({ _id: new ObjectId(id) })
        if (post.deletedCount === 0) {
            return false
        }
        return true

    },
    async createPost(body: CreatePostType, blogId?: string): Promise<PostViewType> {
        let getBlogId = blogId && ObjectId.isValid(blogId) ? blogId : body.blogId

        const newPost: PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(getBlogId),
            blogName: '',
            createdAt: new Date().toISOString()
        }
        const blog = await blogsQueryRepository.findBlog(getBlogId)
        if (blog) {
            newPost.blogName = blog.name
        }
        await postsCollection.insertOne(newPost)
        return postsQueryRepository.mapToOutput(newPost) //обычный repo не должен мапить данные
    },
    async updatePost(body: CreatePostType, id: string): Promise<boolean> {
        const post = await postsQueryRepository.findPost(id)
        if (!post) {
            return false
        }
        const updatedPost: PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(body.blogId),
            blogName: '',
            createdAt: post.createdAt
        }
        const blog = await blogsQueryRepository.findBlog(body.blogId.toString())
        if (blog) {
            updatedPost.blogName = blog.name
        }
        await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPost })
        return true
    },
}