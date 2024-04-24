"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersEmailConfirmationsModel = exports.usersEmailConfirmationsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.usersEmailConfirmationsSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: false },
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
});
exports.UsersEmailConfirmationsModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.USERS_EMAIL_CONFIRMATIONS, exports.usersEmailConfirmationsSchema);
