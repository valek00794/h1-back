"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoController = void 0;
const db_1 = require("../db/db");
const video_types_1 = require("../types/video-types");
const VALIDATE_PHARAMS = {
    titleMaxLength: 40,
    authoraxLength: 20,
    minAgeRestrictionPossible: 1,
    maxAgeRestrictionPossible: 18,
};
const validationErrorsMassages = {
    minAgeRestriction: `Field will be null or will be more than ${VALIDATE_PHARAMS.minAgeRestrictionPossible} and less then ${VALIDATE_PHARAMS.maxAgeRestrictionPossible}`,
    title: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.titleMaxLength}`,
    author: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.authoraxLength}`,
    availableResolutions: `Field will be includes values ${Object.values(video_types_1.Resolutions)}`,
};
let apiErrors = [];
const createVideoController = (req, res) => {
    const createdAt = new Date();
    const newId = Date.parse(createdAt.toISOString());
    const title = req.body.title;
    const author = req.body.author;
    const defaultPublicationDate = new Date(new Date().setDate(new Date().getDate() + 1));
    const publicationDate = req.body.publicationDate ? req.body.publicationDate : defaultPublicationDate;
    const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
    const canBeDownloaded = req.body.canBeDownloaded ? true : false;
    const availableResolutions = req.body.availableResolutions;
    const validateNewVideo = () => {
        apiErrors = [];
        let isMinAgeRestrictionValidated = false;
        let isTitleValidated = false;
        let isAuthorValidated = false;
        const isAvailableResolutionsValidated = availableResolutions.every((availableResolution) => Object.values(video_types_1.Resolutions).includes(availableResolution));
        if ((minAgeRestriction <= VALIDATE_PHARAMS.maxAgeRestrictionPossible &&
            minAgeRestriction >= VALIDATE_PHARAMS.minAgeRestrictionPossible) ||
            minAgeRestriction === null) {
            isMinAgeRestrictionValidated = true;
        }
        else {
            apiErrors.push({ field: "minAgeRestriction", message: validationErrorsMassages.minAgeRestriction });
        }
        if (title && title.length <= VALIDATE_PHARAMS.titleMaxLength) {
            isTitleValidated = true;
        }
        else {
            apiErrors.push({ field: "title", message: validationErrorsMassages.title });
        }
        if (author && author.length <= VALIDATE_PHARAMS.authoraxLength) {
            isAuthorValidated = true;
        }
        else {
            apiErrors.push({ field: "author", message: validationErrorsMassages.author });
        }
        if (!isAvailableResolutionsValidated) {
            apiErrors.push({ field: "availableResolutions", message: validationErrorsMassages.availableResolutions });
        }
        return isMinAgeRestrictionValidated && isTitleValidated && isAuthorValidated && isAvailableResolutionsValidated;
    };
    const newVideo = {
        id: newId,
        title: title,
        author: author,
        canBeDownloaded: canBeDownloaded,
        minAgeRestriction: minAgeRestriction,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: availableResolutions
    };
    const isValidate = validateNewVideo();
    if (isValidate) {
        db_1.db.videos.push(newVideo);
        res
            .status(201)
            .json(newVideo);
    }
    else {
        res
            .status(400)
            .json({
            errorsMessages: apiErrors
        });
    }
};
exports.createVideoController = createVideoController;
