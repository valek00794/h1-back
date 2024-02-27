"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoController = void 0;
const db_1 = require("../db/db");
const updateVideoController = (req, res) => {
    res
        .status(200)
        .json(db_1.db.videos.find(video => video.id === +req.params.id));
};
exports.updateVideoController = updateVideoController;
