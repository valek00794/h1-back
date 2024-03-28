import { body } from 'express-validator';

export const authInputValidation = [
    body('loginOrEmail').trim()
        .notEmpty().withMessage('The field is required'),
    body('password').trim()
        .notEmpty().withMessage('The field is required')
]
