import { body } from 'express-validator'

import { blogsQueryRepository } from '../composition-root'

const VALIDATE_PHARAMS = {
    titleMaxLength: 30,
    shortDescriptionMaxLength: 100,
    contentMaxLength: 1000,
}

export const postsInputValidation = [
    body('title').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.titleMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.titleMaxLength}`),
    body('shortDescription').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.shortDescriptionMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.shortDescriptionMaxLength}`),
    body('content').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ max: VALIDATE_PHARAMS.contentMaxLength }).withMessage(`The field length must be less than ${VALIDATE_PHARAMS.contentMaxLength}`),
]

export const postsBlogIdInputValidation = [
    body('blogId').trim()
        .notEmpty().withMessage('The field is required'),
    body('blogId').custom(async (value) => {
        const blogs = await blogsQueryRepository.findBlog(value)
        if (blogs === null) {
            throw new Error('Blog not found')
        }
        return value
    })
]
