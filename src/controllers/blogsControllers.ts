import { Request, Response } from 'express'

import { BlogViewType, PaginatorBlogViewType } from '../types/blogs-types';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { blogsService } from '../services/blogs-service';
import { StatusCodes } from '../settings';

export const getBlogsController = async (req: Request, res: Response<PaginatorBlogViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const blogs = await blogsQueryRepository.getBlogs(query)
    res
        .status(StatusCodes.OK_200)
        .json(blogs)
}

export const findBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blog = await blogsQueryRepository.findBlog(req.params.id)
    if (!blog) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(StatusCodes.OK_200)
        .json(blog)

}

export const deleteBlogController = async (req: Request, res: Response<boolean>) => {
    const blogIsDeleted = await blogsService.deleteBlog(req.params.id)
    if (!blogIsDeleted) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
}

export const createBlogController = async (req: Request, res: Response<BlogViewType>) => {
    const newBlog = await blogsService.createBlog(req.body)
    res
        .status(StatusCodes.CREATED_201)
        .json(newBlog)
}

export const updateBlogController = async (req: Request, res: Response<boolean>) => {
    const blog = await blogsQueryRepository.findBlog(req.params.id)
    if (blog === null) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    const updatedBlog = await blogsService.updateBlog(req.body, req.params.id)
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
}