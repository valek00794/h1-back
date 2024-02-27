import { Request, Response } from 'express'
import { db } from '../db/db'
import { APIErrorResult, FieldError } from '../types/validation-types';

const validationErrorsMassages = {
    id: `Not found video with the requested ID for removing`,
};

let apiErrors: FieldError[] = []

export const deleteVideoController = (req: Request, res: Response<APIErrorResult>) => {
    apiErrors = []
    const idVideo = db.videos.findIndex(video => video.id === +req.params.id)
    if (idVideo === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        db.videos.splice(idVideo, 1)
        res
            .status(204)
            .send()
    }
}