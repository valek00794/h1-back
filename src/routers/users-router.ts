import { Router } from "express";

import { usersController } from "../controllers/usersController";
import { userDataInputValidation } from "../validation/usersInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const usersRouter = Router();

usersRouter.get('/', authMiddleware, usersController.getUsersController)
usersRouter.post('/', authMiddleware, userDataInputValidation, inputValidationMiddleware, usersController.createUserController)
usersRouter.delete('/:id', authMiddleware, usersController.deleteUserController)