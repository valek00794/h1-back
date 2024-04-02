"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentInputValidation = void 0;
const express_validator_1 = require("express-validator");
const VALIDATE_PHARAMS = {
    content: {
        minLength: 20,
        maxLength: 300
    }
};
exports.commentInputValidation = [
    (0, express_validator_1.body)('content').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.content.minLength, max: VALIDATE_PHARAMS.content.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.content.minLength} to ${VALIDATE_PHARAMS.content.maxLength}`),
];
