import { Router } from "express";

import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController, getAuthInfoController, signUpConfimationController, signUpController, signUpEmailResendingController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { confirmationCodeInputValidation, emailInputValidation, userDataInputValidation } from "../validation/usersInputValidation";

export const authRouter = Router();

authRouter.post('/login', authInputValidation, inputValidationMiddleware, checkAuthController)
authRouter.get('/me', authJWTMiddleware, getAuthInfoController)
authRouter.post('/registration', userDataInputValidation, inputValidationMiddleware, signUpController)
authRouter.post('/registration-confirmation', confirmationCodeInputValidation, inputValidationMiddleware, signUpConfimationController)
authRouter.post('/registration-email-resending', emailInputValidation, inputValidationMiddleware, signUpEmailResendingController)