import { Request, Response } from 'express'
import { db } from '../db/db'
import { APIErrorResult, FieldError } from '../types/errors';
import { OutputVideoType } from '../types/video';

const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
};

let apiErrors: FieldError[] = []

export const findVideoController = (req: Request, res: Response<APIErrorResult | OutputVideoType>) => {
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
        res
            .status(200)
            .json(db.videos[idVideo])
    }
}