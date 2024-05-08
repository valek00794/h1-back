import { Request, Response } from 'express'

import { PostViewType } from '../types/posts-types'
import { SearchQueryParametersType } from '../types/query-types';
import { postsQueryRepository } from '../repositories/posts-query-repository';
import { postsService } from '../services/posts-service';
import { StatusCodes } from '../settings';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { Paginator } from '../types/result-types';

class PostsController {
    async getPostsController(req: Request, res: Response<Paginator<PostViewType[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const posts = await postsQueryRepository.getPosts(query)
        res
            .status(StatusCodes.OK_200)
            .json(posts)
    }

    async findPostController(req: Request, res: Response<false | PostViewType>) {
        const post = await postsQueryRepository.findPost(req.params.id)
        if (!post) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        res
            .status(StatusCodes.OK_200)
            .json(post)
    }

    async findPostsOfBlogController(req: Request, res: Response<Paginator<PostViewType[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const blog = await blogsQueryRepository.findBlog(req.params.blogId)
        if (!blog) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const posts = await postsQueryRepository.getPosts(query, req.params.blogId)
        res
            .status(StatusCodes.OK_200)
            .json(posts)
    }

    async deletePostController(req: Request, res: Response<boolean>) {
        const postIsDeleted = await postsService.deletePost(req.params.id)
        if (!postIsDeleted) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }

    async createPostController(req: Request, res: Response<PostViewType>) {
        const createdPost = await postsService.createPost(req.body)
        const newPost = postsQueryRepository.mapToOutput(createdPost)
        res
            .status(StatusCodes.CREATED_201)
            .json(newPost)
    }

    async createPostForBlogController(req: Request, res: Response<PostViewType>) {
        const blog = await blogsQueryRepository.findBlog(req.params.blogId)
        if (!blog) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const createdPost = await postsService.createPost(req.body, req.params.blogId)
        const newPost = postsQueryRepository.mapToOutput(createdPost)
        res
            .status(StatusCodes.CREATED_201)
            .json(newPost)
    }

    async updatePostController(req: Request, res: Response<boolean>) {
        const isUpdatedPost = await postsService.updatePost(req.body, req.params.id)
        if (!isUpdatedPost) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }

}
export const postsController = new PostsController()
