"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = void 0;
const db_1 = require("../db/db");
const deleteVideoController = (req, res) => {
    const idVideo = db_1.db.videos.findIndex(video => video.id === +req.params.id);
    if (idVideo === -1) {
        res
            .status(404)
            .json({ message: 'id not found' });
    }
    else {
        db_1.db.videos.splice(idVideo, 1);
        res
            .status(204);
    }
};
exports.deleteVideoController = deleteVideoController;
