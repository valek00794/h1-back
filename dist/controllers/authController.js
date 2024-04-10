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
exports.signUpEmailResendingController = exports.signUpConfimationController = exports.signUpController = exports.getAuthInfoController = exports.checkAuthController = void 0;
const users_service_1 = require("../services/users-service");
const jwt_service_1 = require("../adapters/jwt/jwt-service");
const users_query_repository_1 = require("../repositories/users-query-repository");
const result_types_1 = require("../types/result-types");
const checkAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredential(req.body.loginOrEmail, req.body.password);
    if (!user) {
        res
            .status(result_types_1.ResultStatus.UNAUTHORIZED_401)
            .send();
        return;
    }
    const token = yield jwt_service_1.jwtService.createJWT(user);
    res
        .status(result_types_1.ResultStatus.OK_200)
        .send(token);
});
exports.checkAuthController = checkAuthController;
const getAuthInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        res
            .status(result_types_1.ResultStatus.UNAUTHORIZED_401)
            .send();
        return;
    }
    const user = yield users_query_repository_1.usersQueryRepository.findUserById(req.user.userId);
    if (!user) {
        res
            .status(result_types_1.ResultStatus.UNAUTHORIZED_401)
            .send();
        return;
    }
    res
        .status(result_types_1.ResultStatus.OK_200)
        .send(user);
});
exports.getAuthInfoController = getAuthInfoController;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.usersService.createUser(req.body.login, req.body.email, req.body.password, true);
    if (result.status === result_types_1.ResultStatus.BAD_REQUEST_400) {
        res
            .status(result.status)
            .json(result.data);
        return;
    }
    if (result.status === result_types_1.ResultStatus.NO_CONTENT_204) {
        res
            .status(result.status)
            .json();
        return;
    }
});
exports.signUpController = signUpController;
const signUpConfimationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmResult = yield users_service_1.usersService.confirmEmail(req.body.code);
    if (confirmResult.status === result_types_1.ResultStatus.BAD_REQUEST_400) {
        res
            .status(result_types_1.ResultStatus.BAD_REQUEST_400)
            .send(confirmResult.data);
        return;
    }
    if (confirmResult.status === result_types_1.ResultStatus.NO_CONTENT_204) {
        res
            .status(result_types_1.ResultStatus.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.signUpConfimationController = signUpConfimationController;
const signUpEmailResendingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sendResult = yield users_service_1.usersService.resentConfirmEmail(req.body.email);
    if (sendResult.status === result_types_1.ResultStatus.BAD_REQUEST_400) {
        res
            .status(result_types_1.ResultStatus.BAD_REQUEST_400)
            .send(sendResult.data);
        return;
    }
    if (sendResult.status === result_types_1.ResultStatus.NO_CONTENT_204) {
        res
            .status(result_types_1.ResultStatus.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.signUpEmailResendingController = signUpEmailResendingController;
