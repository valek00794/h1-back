import { Router } from "express";
import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController, getAuthInfoController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router();

authRouter.post('/login', authInputValidation, inputValidationMiddleware, checkAuthController)
authRouter.get('/me', authMiddleware, getAuthInfoController)