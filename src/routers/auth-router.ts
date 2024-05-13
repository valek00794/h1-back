import { Router } from "express";

import { authInputValidation } from "../validation/authInputValidation";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { authJWTMiddleware } from "../middlewares/authJWTMiddleware";
import { confirmationCodeInputValidation, emailInputValidation, recoveryCodeInputValidation, userDataInputValidation } from "../validation/usersInputValidation";
import { apiRequestsCounterMiddleware, apiRequestsLogMiddleware } from "../middlewares/apiRequestsLogMiddleware";
import { container } from "../composition-root";
import { AuthController } from "../controllers/authController";

const authController = container.resolve(AuthController)
export const authRouter = Router();

authRouter.post('/login', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, authInputValidation, inputValidationMiddleware, authController.signInController.bind(authController))
authRouter.get('/me', authJWTMiddleware, authController.getAuthInfoController.bind(authController))
authRouter.post('/registration', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, userDataInputValidation, inputValidationMiddleware, authController.signUpController.bind(authController))
authRouter.post('/registration-confirmation', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, confirmationCodeInputValidation, inputValidationMiddleware, authController.signUpConfimationController.bind(authController))
authRouter.post('/registration-email-resending', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, emailInputValidation, inputValidationMiddleware, authController.signUpEmailResendingController.bind(authController))
authRouter.post('/refresh-token', authController.refreshTokenController.bind(authController))
authRouter.post('/logout', authController.logoutController.bind(authController))
authRouter.post('/password-recovery', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, emailInputValidation, inputValidationMiddleware, authController.passwordRecoveryController.bind(authController))
authRouter.post('/new-password', apiRequestsLogMiddleware, apiRequestsCounterMiddleware, recoveryCodeInputValidation, inputValidationMiddleware, authController.confirmPasswordRecoveryController.bind(authController))