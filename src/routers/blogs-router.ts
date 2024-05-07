import { Router } from "express";

import { blogsController } from '../controllers/blogsControllers'
import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsController } from "../controllers/postsControllers";
import { postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogsController)
blogsRouter.get('/:id', blogsController.findBlogController)
blogsRouter.get('/:blogId/posts', postsController.findPostsOfBlogController)
blogsRouter.post('/:blogId/posts', authMiddleware, postsInputValidation, inputValidationMiddleware, postsController.createPostForBlogController)
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.createBlogController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.updateBlogController)
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlogController)