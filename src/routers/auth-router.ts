import { Router } from "express";
import { authInputValidation } from "../validation/authInputValidation";
import { checkAuthController } from "../controllers/authController";

export const authRouter = Router();

authRouter.post('/', authInputValidation, checkAuthController)
