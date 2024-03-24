"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsInputValidation = exports.VALIDATE_PHARAMS = void 0;
const express_validator_1 = require("express-validator");
exports.VALIDATE_PHARAMS = {
    nameMaxLength: 15,
    descriptionMaxLength: 500,
    websiteUrlMaxLength: 100,
    websiteUrlPattern: '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
};
exports.blogsInputValidation = [
    (0, express_validator_1.body)('name').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: exports.VALIDATE_PHARAMS.nameMaxLength }).withMessage(`The field length must be less than ${exports.VALIDATE_PHARAMS.nameMaxLength}`),
    (0, express_validator_1.body)('description').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: exports.VALIDATE_PHARAMS.descriptionMaxLength }).withMessage(`The field length must be less than ${exports.VALIDATE_PHARAMS.descriptionMaxLength}`),
    (0, express_validator_1.body)('websiteUrl').trim()
        .notEmpty().withMessage('The field is required')
        .matches(exports.VALIDATE_PHARAMS.websiteUrlPattern).withMessage(`The field has a pattern ${exports.VALIDATE_PHARAMS.websiteUrlPattern}`)
        .isLength({ max: exports.VALIDATE_PHARAMS.websiteUrlMaxLength }).withMessage(`The field length must be less than ${exports.VALIDATE_PHARAMS.websiteUrlMaxLength}`)
];
