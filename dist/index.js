"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const express_1 = __importDefault(require("express"));
const getVideosController_1 = require("./controllers/getVideosController");
const findVideoController_1 = require("./controllers/findVideoController");
const createVideoController_1 = require("./controllers/createVideoController");
const deleteVideoController_1 = require("./controllers/deleteVideoController");
const updateVideoController_1 = require("./controllers/updateVideoController");
const clearDbController_1 = require("./controllers/clearDbController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(settings_1.SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${settings_1.SETTINGS.PORT}`);
});
app.get(settings_1.SETTINGS.PATH.videos, getVideosController_1.getVideosController);
app.get(settings_1.SETTINGS.PATH.videosById, findVideoController_1.findVideoController);
app.post(settings_1.SETTINGS.PATH.videos, createVideoController_1.createVideoController);
app.delete(settings_1.SETTINGS.PATH.videosById, deleteVideoController_1.deleteVideoController);
app.put(settings_1.SETTINGS.PATH.videosById, updateVideoController_1.updateVideoController);
app.delete(settings_1.SETTINGS.PATH.videosById, clearDbController_1.clearDbController);
