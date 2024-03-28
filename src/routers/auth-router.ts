import { Router } from "express";
import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";

export const authRouter = Router();

authRouter.post('/', authInputValidation, inputValidationMiddleware, checkAuthController)
