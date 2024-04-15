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
exports.authJWTMiddleware = void 0;
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
const users_query_repository_1 = require("../repositories/users-query-repository");
const settings_1 = require("../settings");
const authJWTMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie_refresh_token = req.cookies.refreshToken;
    if (!req.headers.authorization) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_adapter_1.jwtAdapter.getUserIdByToken(token, settings_1.SETTINGS.JWT.AT_SECRET);
    if (userId) {
        if (!req.user) {
            req.user = {};
        }
        req.user.userId = userId;
        const user = yield users_query_repository_1.usersQueryRepository.findUserById(userId);
        if (user) {
            req.user.login = user.login;
        }
        return next();
    }
    res
        .status(settings_1.StatusCodes.UNAUTHORIZED_401)
        .send();
});
exports.authJWTMiddleware = authJWTMiddleware;
