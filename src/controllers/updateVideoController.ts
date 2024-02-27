import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType, Resolutions, UpdateVideoType } from '../types/video-types'
import { APIErrorResult, FieldError } from '../types/validation-types';

const VALIDATE_PHARAMS = {
    titleMaxLength: 40,
    authoraxLength: 20,
    minAgeRestrictionPossible: 1,
    maxAgeRestrictionPossible: 18,
}

const validationErrorsMassages = {
    minAgeRestriction: `Field will be null or will be more than ${VALIDATE_PHARAMS.minAgeRestrictionPossible} and less then ${VALIDATE_PHARAMS.maxAgeRestrictionPossible}`,
    title: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.titleMaxLength}`,
    author: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.authoraxLength}`,
    availableResolutions: `Field will be includes values ${Object.values(Resolutions)}`,
    id: `Not found video with the requested ID for updating`,
};

let apiErrors: FieldError[] = [];

export const updateVideoController = (req: Request, res: Response<OutputVideoType | APIErrorResult>) => {
    apiErrors = [];
    const idVideo = db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id })
        res
            .status(404)
            .json({
                errorsMessages: apiErrors
            })
    } else {
        const title = req.body.title;
        const author = req.body.author;
        const publicationDate = new Date();
        const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
        const canBeDownloaded = req.body.canBeDownloaded ? true : false;
        const availableResolutions: Resolutions[] = req.body.availableResolutions;

        const validateNewVideo = () => {
            let isMinAgeRestrictionValidated = false;
            let isTitleValidated = false;
            let isAuthorValidated = false;
            const isAvailableResolutionsValidated = availableResolutions.every((availableResolution) => Object.values(Resolutions).includes(availableResolution));

            if ((minAgeRestriction <= VALIDATE_PHARAMS.maxAgeRestrictionPossible &&
                minAgeRestriction >= VALIDATE_PHARAMS.minAgeRestrictionPossible) ||
                minAgeRestriction === null) {
                isMinAgeRestrictionValidated = true;
            } else {
                apiErrors.push({ field: "minAgeRestriction", message: validationErrorsMassages.minAgeRestriction })
            }

            if (title && title.length <= VALIDATE_PHARAMS.titleMaxLength) {
                isTitleValidated = true;
            } else {
                apiErrors.push({ field: "title", message: validationErrorsMassages.title })
            }

            if (author && author.length <= VALIDATE_PHARAMS.authoraxLength) {
                isAuthorValidated = true;
            } else {
                apiErrors.push({ field: "author", message: validationErrorsMassages.author })
            }

            if (!isAvailableResolutionsValidated) {
                apiErrors.push({ field: "availableResolutions", message: validationErrorsMassages.availableResolutions })
            }

            return isMinAgeRestrictionValidated && isTitleValidated && isAuthorValidated && isAvailableResolutionsValidated;
        }
        const updatedVideo: UpdateVideoType = {
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            publicationDate: publicationDate.toISOString(),
            availableResolutions: availableResolutions
        }

        const isValidate = validateNewVideo();

        if (isValidate) {
            db.videos[idVideo] = { id: db.videos[idVideo].id, ...updatedVideo, createdAt: db.videos[idVideo].createdAt }
            res
                .status(204)
                .send()
        } else {
            res
                .status(400)
                .json({
                    errorsMessages: apiErrors
                })
        }
    }
}