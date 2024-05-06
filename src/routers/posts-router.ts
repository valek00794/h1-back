import { Router } from "express";

import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from '../controllers/postsControllers'
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsBlogIdInputValidation, postsInputValidation } from "../validation/postsInputValidation";
import { commentInputValidation } from "../validation/commentInputValidation";
import { createCommentForPostController, getCommentsForPostController } from "../controllers/commentsControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, createPostController)
postsRouter.put('/:id', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authMiddleware, deletePostController)
postsRouter.post('/:postId/comments', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, createCommentForPostController)
postsRouter.get('/:postId/comments', userIdFromJWTMiddleware, getCommentsForPostController)