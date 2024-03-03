import { Request, Response } from 'express'
import { db } from '../db/db'
import { CreatePostType, OutputPostType } from '../types/posts-types'
import { APIErrorResult, FieldError } from '../types/errors-types'
import { postsRepository } from '../repositories/posts-repository';

const validationErrorsMassages = {
    id: 'Not found post with the requested ID',
};

let apiErrors: FieldError[] = []

export const getPostsController = (req: Request, res: Response<OutputPostType[]>) => {
    const posts = postsRepository.getPosts()
    res
        .status(200)
        .json(posts)
}

export const findPostController = (req: Request, res: Response<APIErrorResult | OutputPostType>) => {
    const post = postsRepository.findPost(req.params.id)
    if (!post) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(200)
            .json(post)
    }
}

export const deletePostController = (req: Request, res: Response<APIErrorResult>) => {
    const postIsDeleted = postsRepository.deletePost(req.params.id)
    if (!postIsDeleted) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(204)
            .send()
    }
}

export const createPostController = (req: Request<CreatePostType>, res: Response<OutputPostType | APIErrorResult>) => {
    const newPost = postsRepository.createPost(req.body)
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

export const updatePostController = (req: Request, res: Response<OutputPostType | APIErrorResult>) => {
    const updatedPost = postsRepository.updatePost(req.body, req.params.id)
    if (!updatedPost) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(204)
            .send()
    }
}
