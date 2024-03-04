"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsInputValidation = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
const VALIDATE_PHARAMS = {
    titleMaxLength: 30,
    shortDescriptionMaxLength: 100,
    contentMaxLength: 1000,
};
exports.postsInputValidation = [
    (0, express_validator_1.body)('title').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.titleMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.titleMaxLength}`),
    (0, express_validator_1.body)('shortDescription').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.shortDescriptionMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.shortDescriptionMaxLength}`),
    (0, express_validator_1.body)('content').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.contentMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.contentMaxLength}`),
    (0, express_validator_1.body)('blogId').trim()
        .notEmpty().withMessage('The field is required'),
    (0, express_validator_1.body)('blogId').custom(value => {
        const blogIdIncludes = db_1.db.blogs.findIndex(el => el.id === value);
        if (blogIdIncludes === -1) {
            throw new Error('Blog not found');
        }
        else {
            return value;
        }
    })
];
