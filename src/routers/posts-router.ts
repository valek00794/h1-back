import { Router } from "express";

import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from '../controllers/postsControllers'
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsInputValidation } from "../validation/postsInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', authMiddleware, postsInputValidation, inputValidationMiddleware, createPostController)
postsRouter.put('/:id', authMiddleware, postsInputValidation, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authMiddleware, deletePostController)