"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoController = void 0;
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
    id: `Not found video with the requested ID for updating`,
    canBeDownloaded: 'Field will be only boolean',
    publicationDate: 'Invalid Date'
};
let apiErrors = [];
const updateVideoController = (req, res) => {
    apiErrors = [];
    const idVideo = db_1.db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        const title = req.body.title;
        const author = req.body.author;
        const publicationDate = req.body.publicationDate;
        const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
        const canBeDownloaded = req.body.canBeDownloaded ? req.body.canBeDownloaded : false;
        const availableResolutions = req.body.availableResolutions;
        const validateNewVideo = () => {
            let isMinAgeRestrictionValidated = false;
            let isTitleValidated = false;
            let isAuthorValidated = false;
            let isCanBeDownloadedValidated = false;
            let isPublicationDateValidated = false;
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
            if (typeof (canBeDownloaded) === "boolean") {
                isCanBeDownloadedValidated = true;
            }
            else {
                apiErrors.push({ field: "canBeDownloaded", message: validationErrorsMassages.canBeDownloaded });
            }
            if (new Date(publicationDate).toString() !== "Invalid Date") {
                isPublicationDateValidated = true;
            }
            else {
                apiErrors.push({ field: "publicationDate", message: validationErrorsMassages.publicationDate });
            }
            return isMinAgeRestrictionValidated && isTitleValidated && isAuthorValidated &&
                isAvailableResolutionsValidated && isCanBeDownloadedValidated && isPublicationDateValidated;
        };
        const updatedVideo = {
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            publicationDate: publicationDate.toISOString(),
            availableResolutions: availableResolutions
        };
        const isValidate = validateNewVideo();
        if (isValidate) {
            db_1.db.videos[idVideo] = Object.assign(Object.assign({ id: db_1.db.videos[idVideo].id }, updatedVideo), { createdAt: db_1.db.videos[idVideo].createdAt });
            res
                .status(204)
                .send();
        }
        else {
            res
                .status(400)
                .json({
                errorsMessages: apiErrors
            });
        }
    }
};
exports.updateVideoController = updateVideoController;
