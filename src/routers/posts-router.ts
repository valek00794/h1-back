import { Router } from "express";

import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from '../controllers/postsControllers'
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsBlogIdInputValidation, postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, createPostController)
postsRouter.put('/:id', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authMiddleware, deletePostController)