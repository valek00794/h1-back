import { Router } from "express";

import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from '../controllers/postsControllers'
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsInputValidation } from "../validation/postsInputValidation";

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', postsInputValidation, inputValidationMiddleware, createPostController)
postsRouter.put('/:id', postsInputValidation, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', deletePostController)