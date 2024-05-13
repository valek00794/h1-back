import { Router } from "express";

import { commentInputValidation, likeStatusInputValidation } from "../validation/commentInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/commentsController";

const commentsController = container.resolve(CommentsController)
export const commentsRouter = Router();

commentsRouter.get('/:id', userIdFromJWTMiddleware, commentsController.findCommentController.bind(commentsController))
commentsRouter.post('/', authJWTMiddleware, commentsController.createCommentForPostController.bind(commentsController))
commentsRouter.delete('/:commentId', authJWTMiddleware, commentsController.deleteCommentController.bind(commentsController))
commentsRouter.put('/:commentId', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, commentsController.updateCommentForPostController.bind(commentsController))
commentsRouter.put('/:commentId/like-status', authJWTMiddleware, likeStatusInputValidation, inputValidationMiddleware, commentsController.changeCommentLikeStatusController.bind(commentsController))