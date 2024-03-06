import { Router } from "express";

import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from '../controllers/blogsControllers'
import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogsRouter = Router();

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, createBlogController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, updateBlogController)
blogsRouter.delete('/:id', authMiddleware, deleteBlogController)