import { ObjectId } from "mongodb"

import { CreatePostType, PostType, PostViewType } from "../types/posts-types"
import { blogsQueryRepository } from "../repositories/blogs-query-repository"
import { postsQueryRepository } from "../repositories/posts-query-repository"
import { postsRepository } from "../repositories/posts-repository"

export const postsService = {
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
        const createdPost = await postsRepository.createPost(newPost)
        return postsQueryRepository.mapToOutput(createdPost)
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
        const res = await postsRepository.updatePost(updatedPost, id)
        if (!res) {
            return false
        }
        return true
    },

    async deletePost(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await postsRepository.deletePost(id)
    },
}
