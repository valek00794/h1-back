import { Router } from "express";

import { authInputValidation } from "../validation/authInputValidation";
import { authController } from "../controllers/authController";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { confirmationCodeInputValidation, emailInputValidation, recoveryCodeInputValidation, userDataInputValidation } from "../validation/usersInputValidation";
import { apiRequestsCounterMiddleware, apiRequestsLogMiddleware } from "../middlewares/apiRequestsLogMiddleware";

export const authRouter = Router();

authRouter.post('/login', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, authInputValidation, inputValidationMiddleware, authController.signInController)
authRouter.get('/me', authJWTMiddleware, authController.getAuthInfoController)
authRouter.post('/registration', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, userDataInputValidation, inputValidationMiddleware, authController.signUpController)
authRouter.post('/registration-confirmation', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, confirmationCodeInputValidation, inputValidationMiddleware, authController.signUpConfimationController)
authRouter.post('/registration-email-resending', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, emailInputValidation, inputValidationMiddleware, authController.signUpEmailResendingController)
authRouter.post('/refresh-token', authController.refreshTokenController)
authRouter.post('/logout', authController.logoutController)
authRouter.post('/password-recovery', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, emailInputValidation, inputValidationMiddleware, authController.passwordRecoveryController)
authRouter.post('/new-password', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, recoveryCodeInputValidation, inputValidationMiddleware, authController.confirmPasswordRecoveryController)