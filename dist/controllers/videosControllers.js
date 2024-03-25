"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = exports.createVideoController = exports.updateVideoController = exports.findVideoController = exports.getVideosController = void 0;
const db_1 = require("../db/db");
const videos_types_1 = require("../types/videos-types");
const settings_1 = require("../settings");
const VALIDATE_PHARAMS = {
    titleMaxLength: 40,
    authorMaxLength: 20,
    minAgeRestrictionPossible: 1,
    maxAgeRestrictionPossible: 18,
};
const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
    minAgeRestriction: `Field will be null or will be more than ${VALIDATE_PHARAMS.minAgeRestrictionPossible} and less then ${VALIDATE_PHARAMS.maxAgeRestrictionPossible}`,
    title: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.titleMaxLength}`,
    author: `Field is required, not be empty and will be less the ${VALIDATE_PHARAMS.authorMaxLength}`,
    availableResolutions: `Field will be includes values ${Object.values(videos_types_1.Resolutions)}`,
    canBeDownloaded: 'Field will be only boolean',
    publicationDate: 'Invalid Date'
};
let apiErrors = [];
const getVideosController = (req, res) => {
    res
        .status(settings_1.CodeResponses.OK_200)
        .json(db_1.db.videos);
};
exports.getVideosController = getVideosController;
const findVideoController = (req, res) => {
    apiErrors = [];
    const idVideo = db_1.db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        res
            .status(settings_1.CodeResponses.OK_200)
            .json(db_1.db.videos[idVideo]);
    }
};
exports.findVideoController = findVideoController;
const updateVideoController = (req, res) => {
    apiErrors = [];
    const idVideo = db_1.db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        const title = req.body.title;
        const author = req.body.author;
        const publicationDate = new Date(req.body.publicationDate);
        const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
        const canBeDownloaded = req.body.canBeDownloaded ? req.body.canBeDownloaded : false;
        const availableResolutions = req.body.availableResolutions;
        const validateNewVideo = () => {
            let isMinAgeRestrictionValidated = false;
            let isTitleValidated = false;
            let isAuthorValidated = false;
            let isCanBeDownloadedValidated = false;
            let isPublicationDateValidated = false;
            const isAvailableResolutionsValidated = availableResolutions.every((availableResolution) => Object.values(videos_types_1.Resolutions).includes(availableResolution));
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
            if (author && author.length <= VALIDATE_PHARAMS.authorMaxLength) {
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
            if (publicationDate.toString() !== "Invalid Date" && publicationDate > new Date(db_1.db.videos[idVideo].createdAt)) {
                isPublicationDateValidated = true;
            }
            else {
                apiErrors.push({ field: "publicationDate", message: validationErrorsMassages.publicationDate });
            }
            return isMinAgeRestrictionValidated && isTitleValidated && isAuthorValidated &&
                isAvailableResolutionsValidated && isCanBeDownloadedValidated && isPublicationDateValidated;
        };
        const isValidate = validateNewVideo();
        if (isValidate) {
            const updatedVideo = {
                title: title,
                author: author,
                canBeDownloaded: canBeDownloaded,
                minAgeRestriction: minAgeRestriction,
                publicationDate: publicationDate.toISOString(),
                availableResolutions: availableResolutions
            };
            db_1.db.videos[idVideo] = Object.assign(Object.assign({ id: db_1.db.videos[idVideo].id }, updatedVideo), { createdAt: db_1.db.videos[idVideo].createdAt });
            res
                .status(settings_1.CodeResponses.NO_CONTENT_204)
                .send();
        }
        else {
            res
                .status(settings_1.CodeResponses.BAD_REQUEST_400)
                .json({
                errorsMessages: apiErrors
            });
        }
    }
};
exports.updateVideoController = updateVideoController;
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
        const isAvailableResolutionsValidated = availableResolutions.every((availableResolution) => Object.values(videos_types_1.Resolutions).includes(availableResolution));
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
        if (author && author.length <= VALIDATE_PHARAMS.authorMaxLength) {
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
    const isValidate = validateNewVideo();
    if (isValidate) {
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
        db_1.db.videos.push(newVideo);
        res
            .status(settings_1.CodeResponses.CREATED_201)
            .json(newVideo);
    }
    else {
        res
            .status(settings_1.CodeResponses.BAD_REQUEST_400)
            .json({
            errorsMessages: apiErrors
        });
    }
};
exports.createVideoController = createVideoController;
const deleteVideoController = (req, res) => {
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
        db_1.db.videos.splice(idVideo, 1);
        res
            .status(204)
            .send();
    }
};
exports.deleteVideoController = deleteVideoController;
