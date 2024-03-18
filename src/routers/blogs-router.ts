import { Router } from "express";

import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from '../controllers/blogsControllers'
import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createPostForBlogController, findPostsOfBlogController } from "../controllers/postsControllers";
import { postsInputValidation } from "../validation/postsInputValidation";

export const blogsRouter = Router();

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.get('/:blogId/posts', findPostsOfBlogController)
blogsRouter.post('/:blogId/posts', postsInputValidation, inputValidationMiddleware, createPostForBlogController)
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, createBlogController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, updateBlogController)
blogsRouter.delete('/:id', authMiddleware, deleteBlogController)