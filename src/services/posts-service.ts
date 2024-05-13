import { ObjectId } from "mongodb"
import { injectable } from 'inversify';

import { CreatePostType, PostDbType, Post } from "../types/posts-types"
import { BlogsRepository } from "../repositories/blogs-repository"
import { PostsRepository } from "../repositories/posts-repository"

@injectable()
export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
        protected blogsRepository: BlogsRepository,
    ) { }

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
        const blog = await this.blogsRepository.findBlog(getBlogId)
        if (blog) {
            newPost.blogName = blog.name
        }
        return await this.postsRepository.createPost(newPost)
    }

    async updatePost(body: CreatePostType, id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await this.postsRepository.findPost(id)
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
        const blog = await this.blogsRepository.findBlog(body.blogId.toString())
        if (blog) {
            updatedPost.blogName = blog.name
        }
        return await this.postsRepository.updatePost(updatedPost, id)
    }

    async deletePost(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await this.postsRepository.deletePost(id)
    }
}

