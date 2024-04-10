import { Router } from "express";

import { createUserController, deleteUserController, getUsersController } from "../controllers/usersController";
import { userDataInputValidation } from "../validation/usersInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const usersRouter = Router();

usersRouter.get('/', authMiddleware, getUsersController)
usersRouter.post('/', authMiddleware, userDataInputValidation, inputValidationMiddleware, createUserController)
usersRouter.delete('/:id', authMiddleware, deleteUserController)