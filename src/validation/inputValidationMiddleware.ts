import { NextFunction, Request, Response } from 'express'
import { FieldValidationError, Result, validationResult } from 'express-validator'

import { APIErrorResult, FieldError } from '../types/errors-types'
import { CreateBlogType, OutputBlogType } from '../types/blogs-types'

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let apiErrors: FieldError[] = []
    const result = validationResult(req)
    const resultWithFormater: Result<FieldValidationError> = result.formatWith(error => error as FieldValidationError);
    if (!result.isEmpty()) {
        resultWithFormater.array().forEach((error) => {
            const errorIsExists = apiErrors.findIndex(el => el.field === error.path)
            if (errorIsExists === -1) {
                apiErrors.push({ "message": error.msg, "field": error.path })
            } else {
                apiErrors[errorIsExists].message = apiErrors[errorIsExists].message + ' and ' + error.msg
            }
        });
        res
            .status(400)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        next()
    }
}
