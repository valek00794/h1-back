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
exports.confirmPasswordRecoveryController = exports.passwordRecoveryController = exports.logoutController = exports.refreshTokenController = exports.signUpEmailResendingController = exports.signUpConfimationController = exports.signUpController = exports.getAuthInfoController = exports.signInController = void 0;
const users_service_1 = require("../services/users-service");
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
const users_query_repository_1 = require("../repositories/users-query-repository");
const settings_1 = require("../settings");
const auth_service_1 = require("../services/auth-service");
const usersDevices_service_1 = require("../services/usersDevices-service");
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail);
    if (user === null) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const checkCredential = yield auth_service_1.authService.checkCredential(user._id, req.body.password, user.passwordHash);
    if (!checkCredential) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const tokens = yield jwt_adapter_1.jwtAdapter.createJWT(user._id);
    const deviceTitle = req.headers['user-agent'] || 'unknown device';
    const ipAddress = req.ip || '0.0.0.0';
    yield usersDevices_service_1.usersDevicesService.addUserDevice(tokens.refreshToken, deviceTitle, ipAddress);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, });
    res
        .status(settings_1.StatusCodes.OK_200)
        .send({
        accessToken: tokens.accessToken
    });
});
exports.signInController = signInController;
const getAuthInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.usersQueryRepository.findUserById(req.user.userId);
    if (!req.user || !req.user.userId || !user) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    res
        .status(settings_1.StatusCodes.OK_200)
        .send(user);
});
exports.getAuthInfoController = getAuthInfoController;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.usersService.signUpUser(req.body.login, req.body.email, req.body.password);
    if (result.status === settings_1.ResultStatus.BadRequest) {
        res
            .status(settings_1.StatusCodes.BAD_REQUEST_400)
            .json(result.data);
        return;
    }
    if (result.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .json();
        return;
    }
});
exports.signUpController = signUpController;
const signUpConfimationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmResult = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (confirmResult.status === settings_1.ResultStatus.BadRequest) {
        res
            .status(settings_1.StatusCodes.BAD_REQUEST_400)
            .send(confirmResult.data);
        return;
    }
    if (confirmResult.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.signUpConfimationController = signUpConfimationController;
const signUpEmailResendingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sendResult = yield auth_service_1.authService.resentConfirmEmail(req.body.email);
    if (sendResult.status === settings_1.ResultStatus.BadRequest) {
        res
            .status(settings_1.StatusCodes.BAD_REQUEST_400)
            .send(sendResult.data);
        return;
    }
    if (sendResult.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.signUpEmailResendingController = signUpEmailResendingController;
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldRefreshToken = req.cookies.refreshToken;
    const renewResult = yield auth_service_1.authService.renewTokens(oldRefreshToken);
    if (renewResult.status === settings_1.ResultStatus.Unauthorized) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    if (renewResult.status === settings_1.ResultStatus.Success) {
        yield usersDevices_service_1.usersDevicesService.updateUserDevice(oldRefreshToken, renewResult.data.refreshToken);
        res.cookie('refreshToken', renewResult.data.refreshToken, { httpOnly: true, secure: true, });
        res
            .status(settings_1.StatusCodes.OK_200)
            .send({
            accessToken: renewResult.data.accessToken
        });
        return;
    }
});
exports.refreshTokenController = refreshTokenController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const logoutResult = yield auth_service_1.authService.logoutUser(refreshToken);
    if (logoutResult.status === settings_1.ResultStatus.Unauthorized) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    if (logoutResult.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.logoutController = logoutController;
const passwordRecoveryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.passwordRecovery(req.body.email);
    if (result.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.passwordRecoveryController = passwordRecoveryController;
const confirmPasswordRecoveryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.confirmPasswordRecovery(req.body.recoveryCode, req.body.newPassword);
    if (result.status === settings_1.ResultStatus.BadRequest) {
        res
            .status(settings_1.StatusCodes.BAD_REQUEST_400)
            .send(result.data);
        return;
    }
    if (result.status === settings_1.ResultStatus.NoContent) {
        res
            .status(settings_1.StatusCodes.NO_CONTENT_204)
            .send();
        return;
    }
});
exports.confirmPasswordRecoveryController = confirmPasswordRecoveryController;
