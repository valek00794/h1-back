"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDevicesRepository = void 0;
const db_1 = require("../db/db");
const settings_1 = require("../settings");
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
exports.usersDevicesRepository = {
    addUserDevice(refreshToken, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(refreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            const userAgent = req.headers['user-agent'] || 'unknown device';
            const ipAddress = req.ip || 'unknown';
            const device = {
                deviceId: userVerifyInfo.deviceId,
                title: userAgent,
                userId: userVerifyInfo.userId,
                ip: ipAddress,
                lastActiveDate: userVerifyInfo.iat,
                expiryDate: userVerifyInfo.exp,
            };
            return yield db_1.usersDevicesCollection.insertOne(device);
        });
    },
    apdateUserDevice(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(refreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            const deviceId = userVerifyInfo.deviceId;
            const userId = userVerifyInfo.userId;
            const lastActiveDate = userVerifyInfo.iat;
            const expiryDate = userVerifyInfo.exp;
            return yield db_1.usersDevicesCollection.updateOne({ deviceId, userId }, { $set: { lastActiveDate, expiryDate } });
        });
    },
};
