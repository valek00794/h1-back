import { body, param } from 'express-validator';
import { LikeStatus } from '../types/likes-types';
import { commentsQueryRepository } from '../repositories/comments-query-repository';

const VALIDATE_PHARAMS = {
    content: {
        minLength: 20,
        maxLength: 300
    }
}

export const commentInputValidation = [
    body('content').trim()
        .notEmpty().withMessage('The field is required')
        .isLength({ min: VALIDATE_PHARAMS.content.minLength, max: VALIDATE_PHARAMS.content.maxLength })
        .withMessage(`The field length should be from ${VALIDATE_PHARAMS.content.minLength} to ${VALIDATE_PHARAMS.content.maxLength}`),
]

export const likeStatusInputValidation = [
    body('likeStatus').trim()
        .notEmpty().withMessage('The field is required')
        .custom((value: LikeStatus) => {
            if (!Object.values(LikeStatus).includes(value)) {
                throw new Error('Invalid like status value')
            }
            return value
        })
]