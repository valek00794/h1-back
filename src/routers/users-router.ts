import { Router } from "express";

import { userDataInputValidation } from "../validation/usersInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { container } from "../composition-root";
import { UsersController } from "../controllers/usersController";

const usersController = container.resolve(UsersController)
export const usersRouter = Router();

usersRouter.get('/', authMiddleware, usersController.getUsersController.bind(usersController))
usersRouter.post('/', authMiddleware, userDataInputValidation, inputValidationMiddleware, usersController.createUserController.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUserController.bind(usersController))