"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsInputValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
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
    (0, express_validator_1.body)('blogId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield blogs_repository_1.blogsRepository.getBlogs();
        const blogIdIncludes = blogs.findIndex(el => { var _a; return ((_a = el._id) === null || _a === void 0 ? void 0 : _a.toString()) === value; });
        if (blogIdIncludes === -1) {
            throw new Error('Blog not found');
        }
        else {
            return value;
        }
    }))
];
