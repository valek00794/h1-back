import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createCommentForPostController, deleteCommentController, findCommentController } from "../controllers/commentsControllers";

export const commentsRouter = Router();

commentsRouter.get('/:id', authMiddleware, findCommentController)
commentsRouter.post('/', authMiddleware, createCommentForPostController)
commentsRouter.delete('/:id', authMiddleware, deleteCommentController)