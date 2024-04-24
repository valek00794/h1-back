"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModel = exports.BlogsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.BlogsSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
});
exports.BlogsModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.BLOGS, exports.BlogsSchema);
