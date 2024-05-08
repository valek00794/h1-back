import { ObjectId } from "mongodb"

import { CreatePostType, PostDbType, Post } from "../types/posts-types"
import { postsRepository } from "../repositories/posts-repository"
import { blogsRepository } from "../repositories/blogs-repository"

class PostsService {
    async createPost(body: CreatePostType, blogId?: string): Promise<PostDbType> {
        let getBlogId = blogId && ObjectId.isValid(blogId) ? blogId : body.blogId

        const newPost = new Post(
            body.title,
            body.shortDescription,
            body.content,
            new ObjectId(getBlogId),
            '',
            new Date().toISOString()
        )
        const blog = await blogsRepository.findBlog(getBlogId)
        if (blog) {
            newPost.blogName = blog.name
        }
        return await postsRepository.createPost(newPost)
    }

    async updatePost(body: CreatePostType, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await postsRepository.findPost(id)
        if (!post) {
            return false
        }
        const updatedPost = new Post(
            body.title,
            body.shortDescription,
            body.content,
            new ObjectId(body.blogId),
            '',
            post.createdAt
        )
        const blog = await blogsRepository.findBlog(body.blogId.toString())
        if (blog) {
            updatedPost.blogName = blog.name
        }
        return await postsRepository.updatePost(updatedPost, id)
    }

    async deletePost(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await postsRepository.deletePost(id)
    }
}

export const postsService = new PostsService()