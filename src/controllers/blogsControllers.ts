import express, { Request, Response } from 'express'
import { CreateBlogType, OutputBlogType } from '../types/blogs-types'
import { APIErrorResult, FieldError } from '../types/errors-types';
import { blogsRepository } from '../repositories/blogs-repository';
import { FieldValidationError, Result, validationResult } from 'express-validator';
import { inputValidationMiddleware } from '../validation/inputValidationMiddleware';



export const getBlogsController = (req: Request, res: Response<OutputBlogType[]>) => {
    const blogs = blogsRepository.getBlogs()
    res
        .status(200)
        .json(blogs)
}

export const findBlogController = (req: Request, res: Response<APIErrorResult | OutputBlogType>) => {
    const blog = blogsRepository.findBlog(req.params.id)
    if (blog) {
        res
            .status(200)
            .json(blog)

    } else {
        res
            .status(404)
            .send()
    }
}

export const deleteBlogController = (req: Request, res: Response<APIErrorResult>) => {
    const blogIsDeleted = blogsRepository.deleteBlog(req.params.id)
    if (blogIsDeleted) {
        res
            .status(204)
            .send()
    } else {
        res

            .status(404)
            .send()
    }
}

export const createBlogController = (req: Request<CreateBlogType>, res: Response<OutputBlogType | APIErrorResult>) => {
    const newBlog = blogsRepository.createBlog(req.body)
    if (newBlog) {
        res
            .status(201)
            .json(newBlog)
    } else {
        res
            .status(404)
            .send()
    }
}

export const updateBlogController = (req: Request, res: Response<OutputBlogType | APIErrorResult>) => {
    const updatedBlog = blogsRepository.updateBlog(req.body, req.params.id)
    if (updatedBlog) {
        res
            .status(204)
            .send()
    } else {
        res
            .status(404)
            .send()
    }
}