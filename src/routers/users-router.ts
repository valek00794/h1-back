import { Router } from "express";

import { createUserController, deleteUserController, getUsersController } from "../controllers/usersController";
import { usersInputValidation } from "../validation/usersInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";

export const usersRouter = Router();

usersRouter.get('/', authJWTMiddleware, getUsersController)
usersRouter.post('/', authJWTMiddleware, usersInputValidation, inputValidationMiddleware, createUserController)
usersRouter.delete('/:id', authJWTMiddleware, deleteUserController)