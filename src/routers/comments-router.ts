import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createCommentForPostController, deleteCommentController, findCommentController, updateCommentForPostController } from "../controllers/commentsControllers";
import { commentInputValidation } from "../validation/commentInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', findCommentController)
commentsRouter.post('/', authMiddleware, createCommentForPostController)
commentsRouter.delete('/:commentId', authMiddleware, deleteCommentController)
commentsRouter.put('/:commentId', authMiddleware, commentInputValidation, inputValidationMiddleware, updateCommentForPostController)