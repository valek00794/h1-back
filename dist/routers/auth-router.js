"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authInputValidation_1 = require("../validation/authInputValidation");
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/', authInputValidation_1.authInputValidation, authController_1.checkAuthController);
