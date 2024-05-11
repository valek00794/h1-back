import { Request, Response } from 'express'

import { PostView } from '../types/posts-types'
import { SearchQueryParametersType } from '../types/query-types';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';
import { PostsService } from '../services/posts-service';
import { PostsQueryRepository } from '../repositories/posts-query-repository';
import { BlogsQueryRepository } from '../repositories/blogs-query-repository';

export class PostsController {
    constructor(
        protected postsService: PostsService,
        protected postsQueryRepository: PostsQueryRepository,
        protected blogsQueryRepository: BlogsQueryRepository) { }

    async getPostsController(req: Request, res: Response<Paginator<PostView[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const posts = await this.postsQueryRepository.getPosts(query)
        res
            .status(StatusCodes.OK_200)
            .json(posts)
    }

    async findPostController(req: Request, res: Response<false | PostView>) {
        const post = await this.postsQueryRepository.findPost(req.params.id)
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

    async findPostsOfBlogController(req: Request, res: Response<Paginator<PostView[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const blog = await this.blogsQueryRepository.findBlog(req.params.blogId)
        if (!blog) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const posts = await this.postsQueryRepository.getPosts(query, req.params.blogId)
        res
            .status(StatusCodes.OK_200)
            .json(posts)
    }

    async deletePostController(req: Request, res: Response<boolean>) {
        const postIsDeleted = await this.postsService.deletePost(req.params.id)
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

    async createPostController(req: Request, res: Response<PostView>) {
        const createdPost = await this.postsService.createPost(req.body)
        const newPost = this.postsQueryRepository.mapToOutput(createdPost)
        res
            .status(StatusCodes.CREATED_201)
            .json(newPost)
    }

    async createPostForBlogController(req: Request, res: Response<PostView>) {
        const blog = await this.blogsQueryRepository.findBlog(req.params.blogId)
        if (!blog) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        const createdPost = await this.postsService.createPost(req.body, req.params.blogId)
        const newPost = this.postsQueryRepository.mapToOutput(createdPost)
        res
            .status(StatusCodes.CREATED_201)
            .json(newPost)
    }

    async updatePostController(req: Request, res: Response<boolean>) {
        const isUpdatedPost = await this.postsService.updatePost(req.body, req.params.id)
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

