import { Request, Response } from 'express'
import { blogsRepository } from '../repositories/blogs-repository';
import { BlogViewType, PaginatorBlogViewType } from '../types/blogs-types';

export const getBlogsController = async (req: Request, res: Response<PaginatorBlogViewType>) => {
    const blogs = await blogsRepository.getBlogs(req.query)
    res
        .status(200)
        .json(blogs)
}

export const findBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blog = await blogsRepository.findBlog(req.params.id)
    if (!blog) {
        res
            .status(404)
            .send()
        return
    }
    res
        .status(200)
        .json(blog)

}

export const deleteBlogController = async (req: Request, res: Response) => {
    const blogIsDeleted = await blogsRepository.deleteBlog(req.params.id)
    if (!blogIsDeleted) {
        res
            .status(404)
            .send()
        return
    }
    res
        .status(204)
        .send()
}

export const createBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blogInsertedId = await blogsRepository.createBlog(req.body)
    const newBlog = await blogsRepository.findBlog(blogInsertedId)
    res
        .status(201)
        .json(newBlog)
}

export const updateBlogController = async (req: Request, res: Response<boolean>) => {
    const updatedBlog = await blogsRepository.updateBlog(req.body, req.params.id)
    if (!updatedBlog) {
        res
            .status(404)
            .send()
        return
    }
    res
        .status(204)
        .send()
}