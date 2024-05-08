import { Router } from "express";

import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsController } from "../controllers/postsController";
import { postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";
import { blogsController } from "../composition-root";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogsController.bind(blogsController))
blogsRouter.get('/:id', blogsController.findBlogController.bind(blogsController))
blogsRouter.get('/:blogId/posts', postsController.findPostsOfBlogController.bind(blogsController))
blogsRouter.post('/:blogId/posts', authMiddleware, postsInputValidation, inputValidationMiddleware, postsController.createPostForBlogController.bind(blogsController))
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.createBlogController.bind(blogsController))
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.updateBlogController.bind(blogsController))
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlogController.bind(blogsController))