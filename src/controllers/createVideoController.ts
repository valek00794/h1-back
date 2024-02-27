import { Request, Response } from 'express'
import { db } from '../db/db'
import { Resolutions, OutputVideoType, CreateVideoInputType } from '../types/video-types'
import { APIErrorResult, FieldError } from '../types/validation-types'

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
};

let apiErrors: FieldError[] = [];

export const createVideoController = (req: Request<CreateVideoInputType>, res: Response<OutputVideoType | APIErrorResult>) => {
    const newId = db.videos[db.videos.length - 1].id + 1;
    const title = req.body.title;
    const author = req.body.author;
    const date = new Date();
    const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
    const canBeDownloaded = req.body.canBeDownloaded ? true : false;
    const availableResolutions: Resolutions[] = req.body.availableResolutions;

    const validateNewVideo = () => {
        apiErrors = [];
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
    const newVideo: OutputVideoType = {
        id: newId,
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded,
        minAgeRestriction: minAgeRestriction,
        createdAt: date.toISOString(),
        publicationDate: date.toISOString(),
        availableResolutions: availableResolutions
    }

    const isValidate = validateNewVideo();
    
    if (isValidate) {
        db.videos.push(newVideo)
        res
            .status(201)
            .json(newVideo)
    } else {
        res
            .status(400)
            .json({
                errorsMessages: apiErrors
            })
    }
}