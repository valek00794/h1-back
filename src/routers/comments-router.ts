import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteCommentController, findCommentController } from "../controllers/commentsControllers";

export const commentsRouter = Router();

commentsRouter.get('/:id', authMiddleware, findCommentController)
commentsRouter.delete('/:id', authMiddleware, deleteCommentController)