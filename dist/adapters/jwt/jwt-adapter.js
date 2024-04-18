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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const settings_1 = require("../../settings");
exports.jwtAdapter = {
    createJWT(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId }, settings_1.SETTINGS.JWT.AT_SECRET, { expiresIn: settings_1.SETTINGS.JWT.AT_EXPIRES_TIME });
            const getDeviceId = deviceId ? deviceId : (0, uuid_1.v4)();
            const refreshToken = jsonwebtoken_1.default.sign({ userId, deviceId: getDeviceId }, settings_1.SETTINGS.JWT.RT_SECRET, { expiresIn: settings_1.SETTINGS.JWT.RT_EXPIRES_TIME });
            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            };
        });
    },
    getUserInfoByToken(token, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = jsonwebtoken_1.default.verify(token, secret);
                if (typeof res !== 'string') {
                    return { userId: res.userId, deviceId: res.deviceId, iat: res.iat, exp: res.exp };
                }
            }
            catch (error) {
                console.error('Token verify error');
            }
            return null;
        });
    }
};
