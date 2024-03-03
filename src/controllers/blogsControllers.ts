import { Request, Response } from 'express'
import { CreateBlogType, OutputBlogType } from '../types/blogs-types'
import { APIErrorResult } from '../types/errors-types';
import { blogsRepository } from '../repositories/blogs-repository';

export const getBlogsController = (req: Request, res: Response<OutputBlogType[]>) => {
    const blogs = blogsRepository.getBlogs()
    res
        .status(200)
        .json(blogs)
}

export const findBlogController = (req: Request, res: Response<APIErrorResult | OutputBlogType>) => {
    const blog = blogsRepository.findBlog(req.params.id)
    if (!blog) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(200)
            .json(blog)
    }
}

export const deleteBlogController = (req: Request, res: Response<APIErrorResult>) => {
    const blogIsDeleted = blogsRepository.deleteBlog(req.params.id)
    if (!blogIsDeleted) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(204)
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
            .status(400)
            .send()
    }
}

export const updateBlogController = (req: Request, res: Response<OutputBlogType | APIErrorResult>) => {
    const updatedBlog = blogsRepository.updateBlog(req.body, req.params.id)
    if (!updatedBlog) {
        res
            .status(404)
            .send()
    } else {
        res
            .status(204)
            .send()
    }
}