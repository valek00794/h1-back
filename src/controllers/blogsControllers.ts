import { Request, Response } from 'express'
import { blogsRepository } from '../repositories/blogs-repository';
import { BlogViewType } from '../types/blogs-types';

export const getBlogsController = async (req: Request, res: Response<BlogViewType[]>) => {
    const blogs = await blogsRepository.getBlogs()
    res
        .status(200)
        .json(blogs)
}

export const findBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blog = await blogsRepository.findBlog(req.params.id)
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

export const deleteBlogController = async (req: Request, res: Response) => {
    const blogIsDeleted = await blogsRepository.deleteBlog(req.params.id)
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

export const createBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const newBlog = await blogsRepository.createBlog(req.body)
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

export const updateBlogController = async (req: Request, res: Response<boolean>) => {
    const updatedBlog = await blogsRepository.updateBlog(req.body, req.params.id)
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