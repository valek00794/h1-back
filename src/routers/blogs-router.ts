import { Router } from "express";

import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from '../controllers/blogsControllers'
import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../validation/inputValidationMiddleware";

export const blogsRouter = Router();



blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.post('/', blogsInputValidation, inputValidationMiddleware, createBlogController)
blogsRouter.put('/:id', blogsInputValidation, inputValidationMiddleware,  updateBlogController)
blogsRouter.delete('/:id', deleteBlogController)