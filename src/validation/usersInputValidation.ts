import { body } from 'express-validator';

import { usersQueryRepository } from '../repositories/users-query-repository';

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
}

export const userDataInputValidation = [
    body('password').trim()
        .notEmpty()
        .withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.password.minLength, max: VALIDATE_PHARAMS.password.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.password.minLength} to ${VALIDATE_PHARAMS.password.maxLength}`),
    body('login').trim()
        .notEmpty()
        .withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.login.minLength, max: VALIDATE_PHARAMS.login.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.login.minLength} to ${VALIDATE_PHARAMS.login.maxLength}`)
        .matches(VALIDATE_PHARAMS.login.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.login.pattern}`)
        .custom(async (value) => {
            const user = await usersQueryRepository.findUserByLoginOrEmail(value)
            if (user !== null) {
                throw new Error('User with current login already exists');
            } else {
                return value;
            }
        }),
    body('email').trim()
        .notEmpty()
        .withMessage('The field is required')
        .matches(VALIDATE_PHARAMS.email.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.email.pattern}`)
        .custom(async (value) => {
            const user = await usersQueryRepository.findUserByLoginOrEmail(value)
            if (user !== null) {
                throw new Error('User with current email already exists');
            } else {
                return value;
            }
        })
]

export const emailInputValidation = body('email').trim()
    .notEmpty()
    .withMessage('The field is required')
    .matches(VALIDATE_PHARAMS.email.pattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.email.pattern}`)

export const confirmationCodeInputValidation = body('code').trim()
    .notEmpty()
    .withMessage('The field is required')

export const recoveryCodeInputValidation = [
    body('newPassword').trim()
        .notEmpty()
        .withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.password.minLength, max: VALIDATE_PHARAMS.password.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.password.minLength} to ${VALIDATE_PHARAMS.password.maxLength}`),
    body('recoveryCode').trim()
        .notEmpty()
        .withMessage('The field is required')
]



