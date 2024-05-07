import { Request, Response } from 'express'

import { BlogView } from '../types/blogs-types';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { blogsService } from '../services/blogs-service';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';


class BlogsController {
    async getBlogsController(req: Request, res: Response<Paginator<BlogView[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const blogs = await blogsQueryRepository.getBlogs(query)
        res
            .status(StatusCodes.OK_200)
            .json(blogs)
    }

    async findBlogController(req: Request, res: Response<false | BlogView>) {
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

    async deleteBlogController(req: Request, res: Response<boolean>) {
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

    async createBlogController(req: Request, res: Response<BlogView>) {
        const createdBlog = await blogsService.createBlog(req.body)
        const newBlog = blogsQueryRepository.mapToOutput(createdBlog)
        res
            .status(StatusCodes.CREATED_201)
            .json(newBlog)
    }

    async updateBlogController(req: Request, res: Response<boolean>) {
        const blog = await blogsQueryRepository.findBlog(req.params.id)
        if (blog === null) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        await blogsService.updateBlog(req.body, req.params.id)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }
}
export const blogsController = new BlogsController()