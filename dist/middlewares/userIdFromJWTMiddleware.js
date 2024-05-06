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
exports.userIdFromJWTMiddleware = void 0;
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
const settings_1 = require("../settings");
const userIdFromJWTMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(token, settings_1.SETTINGS.JWT.AT_SECRET);
        if (userVerifyInfo) {
            if (!req.user) {
                req.user = {};
            }
            req.user.userId = userVerifyInfo.userId;
        }
    }
    return next();
});
exports.userIdFromJWTMiddleware = userIdFromJWTMiddleware;
