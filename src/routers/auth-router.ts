import { Router } from "express";

import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController, getAuthInfoController, signUpConfimationController, signUpController, signUpEmailResendingController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { emailInputValidation, usersInputValidation } from "../validation/usersInputValidation";

export const authRouter = Router();

authRouter.post('/login', authInputValidation, inputValidationMiddleware, checkAuthController)
authRouter.get('/me', authJWTMiddleware, getAuthInfoController)
authRouter.post('/registration', usersInputValidation, inputValidationMiddleware, signUpController)
authRouter.post('/registration-confirmation', signUpConfimationController)
authRouter.post('/registration-email-resending', emailInputValidation, inputValidationMiddleware, signUpEmailResendingController)