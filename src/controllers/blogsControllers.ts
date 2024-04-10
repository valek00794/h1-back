import { Request, Response } from 'express'

import { BlogViewType, PaginatorBlogViewType } from '../types/blogs-types';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { blogsService } from '../services/blogs-service';
import { ResultStatus } from '../types/result-types';

export const getBlogsController = async (req: Request, res: Response<PaginatorBlogViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const blogs = await blogsQueryRepository.getBlogs(query)
    res
        .status(ResultStatus.OK_200)
        .json(blogs)
}

export const findBlogController = async (req: Request, res: Response<false | BlogViewType>) => {
    const blog = await blogsQueryRepository.findBlog(req.params.id)
    if (!blog) {
        res
            .status(ResultStatus.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(ResultStatus.OK_200)
        .json(blog)

}

export const deleteBlogController = async (req: Request, res: Response<boolean>) => {
    const blogIsDeleted = await blogsService.deleteBlog(req.params.id)
    if (!blogIsDeleted) {
        res
            .status(ResultStatus.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(ResultStatus.NO_CONTENT_204)
        .send()
}

export const createBlogController = async (req: Request, res: Response<BlogViewType>) => {
    const newBlog = await blogsService.createBlog(req.body)
    res
        .status(ResultStatus.CREATED_201)
        .json(newBlog)
}

export const updateBlogController = async (req: Request, res: Response<boolean>) => {
    const updatedBlog = await blogsService.updateBlog(req.body, req.params.id)
    if (!updatedBlog) {
        res
            .status(ResultStatus.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(ResultStatus.NO_CONTENT_204)
        .send()
}