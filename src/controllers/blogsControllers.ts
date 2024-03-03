import { Request, Response } from 'express'
import { db } from '../db/db'
import { CreateBlogType, OutputBlogtType } from '../types/blogs-types'
import { APIErrorResult, FieldError } from '../types/errors-types';

const validationErrorsMassages = {
    id: 'Not found blog with the requested ID',
};

let apiErrors: FieldError[] = []

export const getBlogsController = (req: Request, res: Response<OutputBlogtType[]>) => {
    res
        .status(200)
        .json(db.blogs)
}

export const findBlogController = (req: Request, res: Response<APIErrorResult | OutputBlogtType>) => {
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

export const createBlogController = (req: Request<CreateBlogType>, res: Response<OutputBlogtType | APIErrorResult>) => {
    const newId = Date.parse(new Date().toISOString()).toString()
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const isValidate = true;

    if (isValidate) {
        const newBlog: OutputBlogtType = {
            id: newId,
            name,
            description,
            websiteUrl,
        }
        db.blogs.push(newBlog)
        res
            .status(201)
            .json(newBlog)
    } else {
        res
            .status(400)
            .json({
                errorsMessages: apiErrors
            })
    }
}

export const updateBlogController = (req: Request, res: Response<OutputBlogtType | APIErrorResult>) => {
    apiErrors = [];
    const blogId = db.blogs.findIndex(blog => blog.id === req.params.id);
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        const name = req.body.name
        const description = req.body.description
        const websiteUrl = req.body.websiteUrl

        const isValidate = true

        if (isValidate) {
            const updatedPost: OutputBlogtType = {
                id: db.blogs[blogId].id,
                name,
                description,
                websiteUrl,
            }
            db.blogs[blogId] = { ...updatedPost }
            res
                .status(204)
                .send()
        } else {
            res
                .status(400)
                .json({
                    errorsMessages: apiErrors
                })
        }
    }
}