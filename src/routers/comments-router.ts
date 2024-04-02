import { Router } from "express";

import { createCommentForPostController, deleteCommentController, findCommentController, updateCommentForPostController } from "../controllers/commentsControllers";
import { commentInputValidation } from "../validation/commentInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', findCommentController)
commentsRouter.post('/', authJWTMiddleware, createCommentForPostController)
commentsRouter.delete('/:commentId', authJWTMiddleware, deleteCommentController)
commentsRouter.put('/:commentId', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, updateCommentForPostController)