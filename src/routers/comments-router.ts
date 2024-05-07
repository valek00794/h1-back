import { Router } from "express";

import { commentsController } from "../controllers/commentsControllers";
import { commentInputValidation, likeStatusInputValidation } from "../validation/commentInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', userIdFromJWTMiddleware, commentsController.findCommentController)
commentsRouter.post('/', authJWTMiddleware, commentsController.createCommentForPostController)
commentsRouter.delete('/:commentId', authJWTMiddleware, commentsController.deleteCommentController)
commentsRouter.put('/:commentId', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, commentsController.updateCommentForPostController)
commentsRouter.put('/:commentId/like-status', authJWTMiddleware, likeStatusInputValidation, inputValidationMiddleware, commentsController.changeCommentLikeStatusController)