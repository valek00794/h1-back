"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoController = void 0;
const createVideoController = (req, res) => {
    res
        .status(200)
        .json({ message: 'create new video' });
};
exports.createVideoController = createVideoController;
