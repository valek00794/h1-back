"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequestsModel = exports.apiRequestsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.apiRequestsSchema = new mongoose_1.default.Schema({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
});
exports.ApiRequestsModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.API_REQUESTS, exports.apiRequestsSchema);
