import { Request, Response } from 'express'

import { BlogView } from '../types/blogs-types';
import { SearchQueryParametersType } from '../types/query-types';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';
import { BlogsService } from '../services/blogs-service';
import { BlogsQueryRepository } from '../repositories/blogs-query-repository';


export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        protected blogsQueryRepository: BlogsQueryRepository) { }

    async getBlogsController(req: Request, res: Response<Paginator<BlogView[]>>) {
        const query = req.query as unknown as SearchQueryParametersType;
        const blogs = await this.blogsQueryRepository.getBlogs(query)
        res
            .status(StatusCodes.OK_200)
            .json(blogs)
    }

    async findBlogController(req: Request, res: Response<false | BlogView>) {
        const blog = await this.blogsQueryRepository.findBlog(req.params.id)
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
        const blogIsDeleted = await this.blogsService.deleteBlog(req.params.id)
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
        const createdBlog = await this.blogsService.createBlog(req.body)
        const newBlog = this.blogsQueryRepository.mapToOutput(createdBlog)
        res
            .status(StatusCodes.CREATED_201)
            .json(newBlog)
    }

    async updateBlogController(req: Request, res: Response<boolean>) {
        const updatedBlog = await this.blogsService.updateBlog(req.body, req.params.id)
        if (!updatedBlog) {
            res
                .status(StatusCodes.NOT_FOUND_404)
                .send()
            return
        }
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
    }
}
