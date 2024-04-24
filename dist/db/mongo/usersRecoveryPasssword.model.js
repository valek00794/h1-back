"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRecoveryPassswordModel = exports.usersRecoveryPassswordSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../settings");
exports.usersRecoveryPassswordSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: false },
    expirationDate: { type: Date, required: true },
    recoveryCode: { type: String, required: true },
});
exports.UsersRecoveryPassswordModel = mongoose_1.default.model(settings_1.SETTINGS.DB.collection.USERS_PASSWORD_RECOVERY, exports.usersRecoveryPassswordSchema);
