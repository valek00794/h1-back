import { Router } from "express";

import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from '../controllers/blogsControllers'
import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { createPostForBlogController, findPostsOfBlogController } from "../controllers/postsControllers";
import { postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogsRouter = Router();

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.get('/:blogId/posts', findPostsOfBlogController)
blogsRouter.post('/:blogId/posts', authMiddleware, postsInputValidation, inputValidationMiddleware, createPostForBlogController)
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, createBlogController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, updateBlogController)
blogsRouter.delete('/:id', authMiddleware, deleteBlogController)