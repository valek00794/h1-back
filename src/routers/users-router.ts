import { Router } from "express";

import { createUserController, deleteUserController, getUsersController } from "../controllers/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const usersRouter = Router();

usersRouter.get('/', authMiddleware, getUsersController)
usersRouter.post('/', authMiddleware, createUserController)
usersRouter.delete('/:id', authMiddleware, deleteUserController)