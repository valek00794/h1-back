import { body } from 'express-validator';

const VALIDATE_PHARAMS = {
    content: {
        minLength: 20,
        maxLength:300
    }
}

export const commentInputValidation = [
    body('content').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.content.minLength, max: VALIDATE_PHARAMS.content.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.content.minLength} to ${VALIDATE_PHARAMS.content.maxLength}`),
]


