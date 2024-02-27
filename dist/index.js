"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const getVideosController_1 = require("./controllers/getVideosController");
const findVideoController_1 = require("./controllers/findVideoController");
const createVideoController_1 = require("./controllers/createVideoController");
const deleteVideoController_1 = require("./controllers/deleteVideoController");
const updateVideoController_1 = require("./controllers/updateVideoController");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(settings_1.SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${settings_1.SETTINGS.PORT}`);
});
app.get('/', getVideosController_1.getVideosController);
app.get('/:id', findVideoController_1.findVideoController);
app.post('/', createVideoController_1.createVideoController);
app.delete('/:id', deleteVideoController_1.deleteVideoController);
app.put('/:id', updateVideoController_1.updateVideoController);
