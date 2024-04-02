import { Router } from "express";
import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController, getAuthInfoController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";


export const authRouter = Router();

authRouter.post('/login', authInputValidation, inputValidationMiddleware, checkAuthController)
authRouter.get('/me', authJWTMiddleware, getAuthInfoController)