import { Request, Response } from 'express'

import { PaginatorPostViewType, PostViewType } from '../types/posts-types'
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { postsQueryRepository } from '../repositories/posts-query-repository';
import { postsService } from '../services/posts-service';
import { StatusCodes } from '../settings';


export const getPostsController = async (req: Request, res: Response<PaginatorPostViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const posts = await postsQueryRepository.getPosts(query)
    res
        .status(StatusCodes.OK_200)
        .json(posts)
}

export const findPostController = async (req: Request, res: Response<false | PostViewType>) => {
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

export const findPostsOfBlogController = async (req: Request, res: Response<PaginatorPostViewType>) => {
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

export const deletePostController = async (req: Request, res: Response<boolean>) => {
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

export const createPostController = async (req: Request, res: Response<PostViewType>) => {
    const newPost = await postsService.createPost(req.body)
    res
        .status(StatusCodes.CREATED_201)
        .json(newPost)
}

export const createPostForBlogController = async (req: Request, res: Response<PostViewType>) => {
    const blog = await blogsQueryRepository.findBlog(req.params.blogId)
    if (!blog) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    const newPost = await postsService.createPost(req.body, req.params.blogId)

    res
        .status(StatusCodes.CREATED_201)
        .json(newPost)
}

export const updatePostController = async (req: Request, res: Response<boolean>) => {
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
