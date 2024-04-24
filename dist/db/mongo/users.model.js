"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = exports.UsersSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.UsersSchema = new mongoose_1.default.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordHash: { type: String, required: true },
});
exports.UsersModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.USERS, exports.UsersSchema);
