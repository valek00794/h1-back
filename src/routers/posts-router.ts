import { Router } from "express";

import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsBlogIdInputValidation, postsInputValidation } from "../validation/postsInputValidation";
import { commentInputValidation, likeStatusInputValidation } from "../validation/commentInputValidation";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";
import { commentsController, postsController } from "../composition-root";

export const postsRouter = Router();

postsRouter.get('/', userIdFromJWTMiddleware, postsController.getPostsController.bind(postsController))
postsRouter.get('/:id', userIdFromJWTMiddleware, postsController.findPostController.bind(postsController))
postsRouter.post('/', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, postsController.createPostController.bind(postsController))
postsRouter.put('/:id', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, postsController.updatePostController.bind(postsController))
postsRouter.delete('/:id', authMiddleware, postsController.deletePostController.bind(postsController))
postsRouter.post('/:postId/comments', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, commentsController.createCommentForPostController.bind(commentsController))
postsRouter.get('/:postId/comments', userIdFromJWTMiddleware, commentsController.getCommentsForPostController.bind(commentsController))
postsRouter.put('/:postId/like-status', authJWTMiddleware, likeStatusInputValidation, inputValidationMiddleware, postsController.changePostLikeStatusController.bind(postsController))