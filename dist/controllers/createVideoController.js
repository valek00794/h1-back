"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoController = void 0;
const db_1 = require("../db/db");
const VALIDATE_PHARAMS = {
    titleMaxLength: 40,
    authoraxLength: 20,
    minAgeRestrictionPossible: 1,
    maxAgeRestrictionPossible: 18,
};
const createVideoController = (req, res) => {
    console.log(req.body);
    const newId = db_1.db.videos[db_1.db.videos.length - 1].id + 1;
    const date = new Date();
    const title = req.body.title;
    const author = req.body.author;
    const minAgeRestriction = req.body.minAgeRestriction ? req.body.minAgeRestriction : null;
    const newVideo = {
        "id": newId,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": req.body.canBeDownloaded ? true : false,
        "minAgeRestriction": minAgeRestriction,
        "createdAt": date.toISOString(),
        "publicationDate": date.toISOString(),
        "availableResolutions": req.body.availableResolutions
    };
    const validateNewVideo = () => {
        if (((minAgeRestriction <= VALIDATE_PHARAMS.maxAgeRestrictionPossible &&
            minAgeRestriction >= VALIDATE_PHARAMS.minAgeRestrictionPossible) ||
            minAgeRestriction === null) &&
            title.length <= VALIDATE_PHARAMS.titleMaxLength &&
            author.length <= VALIDATE_PHARAMS.authoraxLength) {
            return true;
        }
        return false;
    };
    const isValidate = validateNewVideo();
    console.log(isValidate);
    if (isValidate) {
        db_1.db.videos.push(newVideo);
        res
            .status(201)
            .json(newVideo);
    }
    else {
        res
            .status(400)
            .json({ message: 'incorrect data' });
    }
};
exports.createVideoController = createVideoController;
