"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosController = void 0;
const db_1 = require("../db/db");
const getVideosController = (req, res) => {
    res
        .status(200)
        .json(db_1.db.videos);
};
exports.getVideosController = getVideosController;
