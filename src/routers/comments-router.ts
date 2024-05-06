import { Router } from "express";

import { changeCommentLikeStatusController, createCommentForPostController, deleteCommentController, findCommentController, updateCommentForPostController } from "../controllers/commentsControllers";
import { commentInputValidation, likeStatusInputValidation } from "../validation/commentInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', userIdFromJWTMiddleware, findCommentController)
commentsRouter.post('/', authJWTMiddleware, createCommentForPostController)
commentsRouter.delete('/:commentId', authJWTMiddleware, deleteCommentController)
commentsRouter.put('/:commentId', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, updateCommentForPostController)
commentsRouter.put('/:commentId/like-status', authJWTMiddleware, likeStatusInputValidation, inputValidationMiddleware, changeCommentLikeStatusController)