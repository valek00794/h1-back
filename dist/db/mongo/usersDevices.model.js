"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDevicesModel = exports.UsersDevicesSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.UsersDevicesSchema = new mongoose_1.default.Schema({
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: String, required: false },
    ip: { type: String, required: true },
    lastActiveDate: { type: String, required: false },
    expiryDate: { type: String, required: false },
});
exports.UsersDevicesModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.USERS_DEVICES, exports.UsersDevicesSchema);
