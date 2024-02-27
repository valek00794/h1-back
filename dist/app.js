"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const settings_1 = require("./settings");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get(`${settings_1.SETTINGS['BASE-URL']}/videos`, (req, res) => {
    res.status(200).json({ message: 'get all videos' });
});
exports.app.post(`${settings_1.SETTINGS['BASE-URL']}/videos`, (req, res) => {
    res.status(200).json({ message: 'create new video' });
});
exports.app.get(`${settings_1.SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({ message: 'get video by id' });
});
exports.app.put(`${settings_1.SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({ message: 'update video by id' });
});
exports.app.delete(`${settings_1.SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({ message: 'delete video by id' });
});
