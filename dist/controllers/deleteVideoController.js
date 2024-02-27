"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = void 0;
const db_1 = require("../db/db");
const validationErrorsMassages = {
    id: `Id not found`,
};
let apiErrors = [];
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
