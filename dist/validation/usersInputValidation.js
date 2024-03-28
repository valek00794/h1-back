"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersInputValidation = void 0;
const express_validator_1 = require("express-validator");
const VALIDATE_PHARAMS = {
    password: {
        minLength: 6,
        maxLength: 20
    },
    login: {
        minLength: 3,
        maxLength: 10,
        pattern: new RegExp(/^[a-zA-Z0-9_-]*$/)
    },
    email: {
        pattern: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    },
};
exports.usersInputValidation = [
    (0, express_validator_1.body)('password').trim()
        .notEmpty()
        .withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.password.minLength, max: VALIDATE_PHARAMS.password.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.password.minLength} to ${VALIDATE_PHARAMS.password.maxLength}`),
    (0, express_validator_1.body)('login').trim()
        .notEmpty()
        .withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.login.minLength, max: VALIDATE_PHARAMS.login.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.login.minLength} to ${VALIDATE_PHARAMS.login.maxLength}`)
        .matches(VALIDATE_PHARAMS.login.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.login.pattern}`),
    (0, express_validator_1.body)('email').trim()
        .notEmpty()
        .withMessage('The field is required')
        .matches(VALIDATE_PHARAMS.email.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.email.pattern}`)
];
