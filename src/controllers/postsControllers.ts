import { Request, Response } from 'express'
import { CreatePostType, PostViewType } from '../types/posts-types'
import { APIErrorResult } from '../types/errors-types'
import { postsRepository } from '../repositories/posts-repository';
import { InsertOneResult } from 'mongodb';

export const getPostsController = async (req: Request, res: Response<PostViewType[]>) => {
    const posts = await postsRepository.getPosts()
    res
        .status(200)
        .json(posts)
}

export const findPostController = async (req: Request, res: Response<false | PostViewType>) => {
    const post = await postsRepository.findPost(req.params.id)
    if (post) {
        res
            .status(200)
            .json(post)
    } else {
        res
            .status(404)
            .send()
    }
}

export const deletePostController = async (req: Request, res: Response) => {
    const postIsDeleted = await postsRepository.deletePost(req.params.id)
    if (postIsDeleted) {
        res
            .status(204)
            .send()
    } else {
        res
            .status(404)
            .send()
    }
}

export const createPostController = async (req: Request<CreatePostType>, res: Response<false | PostViewType>) => {
    const newPost = await postsRepository.createPost(req.body)
    if (newPost) {
        res
            .status(201)
            .json(newPost)
    } else {
        res
            .status(400)
            .send()
    }
}

export const updatePostController = async (req: Request, res: Response<Promise<false | InsertOneResult<PostViewType>> | APIErrorResult>) => {
    const updatedPost = await postsRepository.updatePost(req.body, req.params.id)
    if (updatedPost) {
        res
            .status(204)
            .send()

    } else {
        res
            .status(404)
            .send()
    }
}
