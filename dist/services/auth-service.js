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
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const add_1 = require("date-fns/add");
const mongodb_1 = require("mongodb");
const email_manager_1 = require("../managers/email-manager");
const result_types_1 = require("../types/result-types");
const settings_1 = require("../settings");
const bcypt_adapter_1 = require("../adapters/bcypt-adapter");
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
class AuthService {
    constructor(usersRepository, usersDevicesRepository) {
        this.usersRepository = usersRepository;
        this.usersDevicesRepository = usersDevicesRepository;
    }
    checkCredential(userId, password, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConfirmationInfo = yield this.usersRepository.findUserConfirmationInfo(userId.toString());
            if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed)
                return false;
            const isAuth = yield bcypt_adapter_1.bcryptArapter.checkPassword(password, passwordHash);
            return isAuth ? true : false;
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConfirmationInfo = yield this.usersRepository.findUserConfirmationInfo(code);
            const errors = {
                errorsMessages: []
            };
            if (userConfirmationInfo === null) {
                errors.errorsMessages.push({
                    message: "User with current confirmation code not found",
                    field: "code"
                });
                return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
            }
            if (userConfirmationInfo !== null) {
                if (userConfirmationInfo.isConfirmed) {
                    errors.errorsMessages.push({
                        message: "User with current confirmation code already confirmed",
                        field: "code"
                    });
                }
                if (userConfirmationInfo.confirmationCode !== code) {
                    errors.errorsMessages.push({
                        message: "Verification code does not match",
                        field: "code"
                    });
                }
                if (userConfirmationInfo.expirationDate < new Date()) {
                    errors.errorsMessages.push({
                        message: "Verification code has expired, needs to be requested again",
                        field: "code"
                    });
                }
                if (errors.errorsMessages.length !== 0) {
                    return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
                }
            }
            yield this.usersRepository.updateConfirmation(userConfirmationInfo._id);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
    resentConfirmEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByLoginOrEmail(email);
            const errors = {
                errorsMessages: []
            };
            if (user === null) {
                errors.errorsMessages.push({
                    message: "User with current email not found",
                    field: "email"
                });
                return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
            }
            const userConfirmationInfo = yield this.usersRepository.findUserConfirmationInfo(user._id.toString());
            if (userConfirmationInfo !== null && userConfirmationInfo.isConfirmed) {
                errors.errorsMessages.push({
                    message: "User with current email already confirmed",
                    field: "email"
                });
            }
            const newUserConfirmationInfo = {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, add_1.add)(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            };
            try {
                yield email_manager_1.emailManager.sendEmailConfirmationMessage(email, newUserConfirmationInfo.confirmationCode);
            }
            catch (error) {
                console.error(error);
                this.usersRepository.deleteUserById(user._id.toString());
                errors.errorsMessages.push({
                    message: "Error sending confirmation email",
                    field: "Email sender"
                });
                return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
            }
            yield this.usersRepository.updateConfirmationInfo(user._id, newUserConfirmationInfo);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
    checkUserByRefreshToken(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(oldRefreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            if (!oldRefreshToken || userVerifyInfo === null) {
                return new result_types_1.Result(settings_1.ResultStatus.NotFound, null, null);
            }
            const isUserExists = yield this.usersRepository.findUserById(userVerifyInfo.userId);
            const deviceSession = yield this.usersDevicesRepository.getUserDeviceById(userVerifyInfo.deviceId);
            if (!isUserExists || !deviceSession || new Date(userVerifyInfo.iat * 1000).toISOString() !== (deviceSession === null || deviceSession === void 0 ? void 0 : deviceSession.lastActiveDate)) {
                return new result_types_1.Result(settings_1.ResultStatus.NotFound, null, null);
            }
            const userDeviceInfo = {
                userId: userVerifyInfo.userId,
                deviceId: userVerifyInfo.deviceId,
                iat: userVerifyInfo.iat,
                exp: userVerifyInfo.exp
            };
            return new result_types_1.Result(settings_1.ResultStatus.Success, userDeviceInfo, null);
        });
    }
    renewTokens(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield this.checkUserByRefreshToken(oldRefreshToken);
            if (userVerifyInfo.data === null) {
                return new result_types_1.Result(settings_1.ResultStatus.Unauthorized, null, null);
            }
            const tokens = yield jwt_adapter_1.jwtAdapter.createJWT(new mongodb_1.ObjectId(userVerifyInfo.data.userId), userVerifyInfo.data.deviceId);
            return new result_types_1.Result(settings_1.ResultStatus.Success, tokens, null);
        });
    }
    logoutUser(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield this.checkUserByRefreshToken(oldRefreshToken);
            if (userVerifyInfo.data === null) {
                return new result_types_1.Result(settings_1.ResultStatus.Unauthorized, null, null);
            }
            yield this.usersDevicesRepository.deleteUserDevicebyId(userVerifyInfo.data.deviceId);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
}
exports.AuthService = AuthService;
