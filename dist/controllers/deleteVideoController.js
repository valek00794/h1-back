"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoController = void 0;
const deleteVideoController = (req, res) => {
    res
        .status(200)
        .json({ message: 'delete video by id' });
};
exports.deleteVideoController = deleteVideoController;
