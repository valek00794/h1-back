import { Router } from "express";

import { blogsInputValidation } from "../validation/blogsInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";

import { postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";
import { container } from "../composition-root";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";
import { BlogsController } from "../controllers/blogsController";
import { PostsController } from "../controllers/postsController";

const blogsController = container.resolve(BlogsController)
const postsController = container.resolve(PostsController)
export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogsController.bind(blogsController))
blogsRouter.get('/:id', blogsController.findBlogController.bind(blogsController))
blogsRouter.get('/:blogId/posts', userIdFromJWTMiddleware, postsController.findPostsOfBlogController.bind(postsController))
blogsRouter.post('/:blogId/posts', authMiddleware, postsInputValidation, inputValidationMiddleware, postsController.createPostForBlogController.bind(postsController))
blogsRouter.post('/', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.createBlogController.bind(blogsController))
blogsRouter.put('/:id', authMiddleware, blogsInputValidation, inputValidationMiddleware, blogsController.updateBlogController.bind(blogsController))
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlogController.bind(blogsController))