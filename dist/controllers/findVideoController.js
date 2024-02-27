"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVideoController = void 0;
const db_1 = require("../db/db");
const findVideoController = (req, res) => {
    const idVideo = db_1.db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        res
            .status(404)
            .json({ message: 'id not found' });
    }
    else {
        res
            .status(200)
            .json(db_1.db.videos[idVideo]);
    }
};
exports.findVideoController = findVideoController;
