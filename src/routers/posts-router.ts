import { Router } from "express";

import { postsController } from '../controllers/postsControllers'
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsBlogIdInputValidation, postsInputValidation } from "../validation/postsInputValidation";
import { commentInputValidation } from "../validation/commentInputValidation";
import { commentsController} from "../controllers/commentsControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { userIdFromJWTMiddleware } from "../middlewares/userIdFromJWTMiddleware";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPostsController)
postsRouter.get('/:id', postsController.findPostController)
postsRouter.post('/', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, postsController.createPostController)
postsRouter.put('/:id', authMiddleware, postsInputValidation, postsBlogIdInputValidation, inputValidationMiddleware, postsController.updatePostController)
postsRouter.delete('/:id', authMiddleware, postsController.deletePostController)
postsRouter.post('/:postId/comments', authJWTMiddleware, commentInputValidation, inputValidationMiddleware, commentsController.createCommentForPostController)
postsRouter.get('/:postId/comments', userIdFromJWTMiddleware, commentsController.getCommentsForPostController)