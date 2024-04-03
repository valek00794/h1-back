import { Request, Response } from 'express'

import { blogsRepository } from '../repositories/blogs-repository';
import { BlogViewType, PaginatorBlogViewType } from '../types/blogs-types';
import { CodeResponses } from '../settings';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { SearchQueryParametersType } from '../types/query-types';

export const getBlogsController = async (req: Request, res: Response<PaginatorBlogViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const blogs = await blogsQueryRepository.getBlogs(query)
    res
        .status(CodeResponses.OK_200)
        .json(blogs)
}

export const findBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blog = await blogsQueryRepository.findBlog(req.params.id)
    if (!blog) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.OK_200)
        .json(blog)

}

export const deleteBlogController = async (req: Request, res: Response<boolean>) => {
    const blogIsDeleted = await blogsRepository.deleteBlog(req.params.id)
    if (!blogIsDeleted) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const createBlogController = async (req: Request, res: Response<BlogViewType>) => {
    const newBlog = await blogsRepository.createBlog(req.body)
    res
        .status(CodeResponses.CREATED_201)
        .json(newBlog)
}

export const updateBlogController = async (req: Request, res: Response<boolean>) => {
    const updatedBlog = await blogsRepository.updateBlog(req.body, req.params.id)
    if (!updatedBlog) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}