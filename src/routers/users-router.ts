import { Router } from "express";

import { createUserController, deleteUserController, getUsersController } from "../controllers/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { usersInputValidation } from "../validation/usersInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";

export const usersRouter = Router();

usersRouter.get('/', authMiddleware, getUsersController)
usersRouter.post('/', authMiddleware, usersInputValidation, inputValidationMiddleware, createUserController)
usersRouter.delete('/:id', authMiddleware, deleteUserController)