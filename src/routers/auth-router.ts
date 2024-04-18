import { Router } from "express";

import { authInputValidation } from "../validation/authInputValidation";
import { signInController, getAuthInfoController, signUpConfimationController, signUpController, signUpEmailResendingController, refreshTokenController, logoutController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { confirmationCodeInputValidation, emailInputValidation, userDataInputValidation } from "../validation/usersInputValidation";
import { apiRequestsCounterMiddleware, apiRequestsLogMiddleware } from "../middlewares/apiRequestsLogMiddleware";

export const authRouter = Router();

authRouter.post('/login', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, authInputValidation, inputValidationMiddleware, signInController)
authRouter.get('/me', authJWTMiddleware, getAuthInfoController)
authRouter.post('/registration', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, userDataInputValidation, inputValidationMiddleware, signUpController)
authRouter.post('/registration-confirmation', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, confirmationCodeInputValidation, inputValidationMiddleware, signUpConfimationController)
authRouter.post('/registration-email-resending', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, emailInputValidation, inputValidationMiddleware, signUpEmailResendingController)
authRouter.post('/refresh-token', refreshTokenController)
authRouter.post('/logout', logoutController)