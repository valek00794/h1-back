import { Request, Response } from 'express'
import { db } from '../db/db'
import { BlogViewModel } from '../types/blog'
import { APIErrorResult, FieldError } from '../types/errors';

const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
};

let apiErrors: FieldError[] = []


export const getBlogsController = (req: Request, res: Response<BlogViewModel[]>) => {
    res
    .status(200)
    .json(db.blogs)
}

export const findBlogController = (req: Request, res: Response<APIErrorResult | BlogViewModel>) => {
    apiErrors = []
    const blogId = db.posts.findIndex(blog => blog.id === req.params.id)
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        res
            .status(200)
            .json(db.blogs[blogId])
    }
}

export const deleteBlogController = (req: Request, res: Response<APIErrorResult>) => {
    apiErrors = []
    const blogId = db.blogs.findIndex(blog => blog.id === req.params.id)
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        db.blogs.splice(blogId, 1)
        res
            .status(204)
            .send()
    }
}