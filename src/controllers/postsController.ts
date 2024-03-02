import { Request, Response } from 'express'
import { db } from '../db/db'
import { PostViewModel } from '../types/post'
import { APIErrorResult, FieldError } from '../types/errors'

const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
};

let apiErrors: FieldError[] = []

export const getPostsController = (req: Request, res: Response<PostViewModel[]>) => {
    res
    .status(200)
    .json(db.posts)
}

export const findPostController = (req: Request, res: Response<APIErrorResult | PostViewModel>) => {
    apiErrors = []
    const postId = db.posts.findIndex(post => post.id === req.params.id)
    if (postId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        res
            .status(200)
            .json(db.posts[postId])
    }
}

export const deletePostController = (req: Request, res: Response<APIErrorResult>) => {
    apiErrors = []
    const postId = db.posts.findIndex(post => post.id === req.params.id)
    if (postId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        db.posts.splice(postId, 1)
        res
            .status(204)
            .send()
    }
}