import { Router } from "express";

import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from '../controllers/blogsControllers'

export const blogsRouter = Router();

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.post('/', createBlogController)
blogsRouter.put('/:id', updateBlogController)
blogsRouter.delete('/:id', deleteBlogController)