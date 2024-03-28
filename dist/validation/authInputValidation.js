"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInputValidation = void 0;
const express_validator_1 = require("express-validator");
exports.authInputValidation = [
    (0, express_validator_1.body)('loginOrEmail').trim()
        .notEmpty().withMessage('The field is required'),
    (0, express_validator_1.body)('password').trim()
        .notEmpty().withMessage('The field is required')
];
