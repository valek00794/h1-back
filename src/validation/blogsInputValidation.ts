import { body, param } from 'express-validator';

const VALIDATE_PHARAMS = {
    nameMaxLength: 15,
    descriptionMaxLength: 500,
    websiteUrlMaxLength: 100,
    websiteUrlPattern: '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
}

export const blogsInputValidation = [
    body('name').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.nameMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.nameMaxLength}`),
    body('description').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.descriptionMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.descriptionMaxLength}`),
    body('websiteUrl').trim()
        .notEmpty().withMessage('The field is required')
        .matches(VALIDATE_PHARAMS.websiteUrlPattern).withMessage(`The field has a pattern ${VALIDATE_PHARAMS.websiteUrlPattern}`)
        .isLength({ max: VALIDATE_PHARAMS.websiteUrlMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.websiteUrlMaxLength}`)
]
