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
exports.getAuthInfoController = exports.checkAuthController = void 0;
const settings_1 = require("../settings");
const users_service_1 = require("../services/users-service");
const jwt_service_1 = require("../application/jwt-service");
const users_query_repository_1 = require("../repositories/users-query-repository");
const checkAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredential(req.body.loginOrEmail, req.body.password);
    if (!user) {
        res
            .status(settings_1.CodeResponses.UNAUTHORIZED_401)
            .send();
        return;
    }
    const token = yield jwt_service_1.jwtService.createJWT(user);
    res
        .status(settings_1.CodeResponses.OK_200)
        .send(token);
});
exports.checkAuthController = checkAuthController;
const getAuthInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.CodeResponses.UNAUTHORIZED_401)
            .send();
        return;
    }
    const user = yield users_query_repository_1.usersQueryRepository.findUserById(req.user.userId);
    res
        .status(settings_1.CodeResponses.OK_200)
        .send(user);
});
exports.getAuthInfoController = getAuthInfoController;
