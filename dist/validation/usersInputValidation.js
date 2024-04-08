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
exports.emailInputValidation = exports.usersInputValidation = void 0;
const express_validator_1 = require("express-validator");
const users_query_repository_1 = require("../repositories/users-query-repository");
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
        .matches(VALIDATE_PHARAMS.login.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.login.pattern}`)
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(value);
        if (user !== null) {
            throw new Error('User with current login already exists');
        }
        else {
            return value;
        }
    })),
    (0, express_validator_1.body)('email').trim()
        .notEmpty()
        .withMessage('The field is required')
        .matches(VALIDATE_PHARAMS.email.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.email.pattern}`)
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(value);
        if (user !== null) {
            throw new Error('User with current email already exists');
        }
        else {
            return value;
        }
    }))
];
exports.emailInputValidation = (0, express_validator_1.body)('email').trim()
    .notEmpty();
