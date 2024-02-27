"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVideoController = void 0;
const db_1 = require("../db/db");
const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
};
let apiErrors = [];
const findVideoController = (req, res) => {
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
        res
            .status(200)
            .json(db_1.db.videos[idVideo]);
    }
};
exports.findVideoController = findVideoController;
