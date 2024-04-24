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
exports.authService = void 0;
const uuid_1 = require("uuid");
const add_1 = require("date-fns/add");
const users_query_repository_1 = require("../repositories/users-query-repository");
const users_repository_1 = require("../repositories/users-repository");
const email_manager_1 = require("../managers/email-manager");
const settings_1 = require("../settings");
const bcypt_adapter_1 = require("../adapters/bcypt-adapter");
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
const mongodb_1 = require("mongodb");
const usersDevices_query_repository_1 = require("../repositories/usersDevices-query-repository");
const usersDevices_repository_1 = require("../repositories/usersDevices-repository");
const users_service_1 = require("./users-service");
exports.authService = {
    checkCredential(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
            if (user === null)
                return false;
            const userConfirmationInfo = yield users_query_repository_1.usersQueryRepository.findUserConfirmationInfo(user._id.toString());
            if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed)
                return false;
            const isAuth = yield bcypt_adapter_1.bcryptArapter.checkPassword(password, user.passwordHash);
            return isAuth ? user : false;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConfirmationInfo = yield users_query_repository_1.usersQueryRepository.findUserConfirmationInfo(code);
            if (userConfirmationInfo === null)
                return {
                    status: settings_1.ResultStatus.BadRequest,
                    data: {
                        errorsMessages: [{
                                message: "User with current confirmation code not found",
                                field: "code"
                            }]
                    }
                };
            const errorsMessages = {
                errorsMessages: []
            };
            if (userConfirmationInfo !== null) {
                if (userConfirmationInfo.isConfirmed) {
                    errorsMessages.errorsMessages.push({
                        message: "User with current confirmation code already confirmed",
                        field: "code"
                    });
                }
                if (userConfirmationInfo.confirmationCode !== code) {
                    errorsMessages.errorsMessages.push({
                        message: "Verification code does not match",
                        field: "code"
                    });
                }
                if (userConfirmationInfo.expirationDate < new Date()) {
                    errorsMessages.errorsMessages.push({
                        message: "Verification code has expired, needs to be requested again",
                        field: "code"
                    });
                }
                if (errorsMessages.errorsMessages.length !== 0) {
                    return {
                        status: settings_1.ResultStatus.BadRequest,
                        data: errorsMessages
                    };
                }
            }
            yield users_repository_1.usersRepository.updateConfirmation(userConfirmationInfo._id);
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
    resentConfirmEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(email);
            const errorsMessages = {
                errorsMessages: []
            };
            if (user === null) {
                errorsMessages.errorsMessages.push({
                    message: "User with current email not found",
                    field: "email"
                });
            }
            const userConfirmationInfo = yield users_query_repository_1.usersQueryRepository.findUserConfirmationInfo(user._id.toString());
            if (userConfirmationInfo !== null && userConfirmationInfo.isConfirmed) {
                errorsMessages.errorsMessages.push({
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
                users_repository_1.usersRepository.deleteUserById(user._id.toString());
                errorsMessages.errorsMessages.push({
                    message: "Error sending confirmation email",
                    field: "Email sender"
                });
                return {
                    status: settings_1.ResultStatus.BadRequest,
                    data: errorsMessages
                };
            }
            yield users_repository_1.usersRepository.updateConfirmationInfo(user._id, newUserConfirmationInfo);
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
    ckeckUserByRefreshToken(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(oldRefreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            if (!oldRefreshToken || userVerifyInfo === null) {
                return null;
            }
            const isUserExists = yield users_query_repository_1.usersQueryRepository.findUserById(userVerifyInfo.userId);
            const deviceSeccion = yield usersDevices_query_repository_1.usersDevicesQueryRepository.getUserDeviceById(userVerifyInfo.deviceId);
            if (!isUserExists ||
                deviceSeccion === null ||
                new Date(userVerifyInfo.iat * 1000).toISOString() !== (deviceSeccion === null || deviceSeccion === void 0 ? void 0 : deviceSeccion.lastActiveDate)) {
                return null;
            }
            return { userId: userVerifyInfo.userId, deviceId: userVerifyInfo.deviceId, iat: userVerifyInfo.iat, exp: userVerifyInfo.exp };
        });
    },
    renewTokens(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield this.ckeckUserByRefreshToken(oldRefreshToken);
            if (userVerifyInfo === null) {
                return {
                    status: settings_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            const tokens = yield jwt_adapter_1.jwtAdapter.createJWT(new mongodb_1.ObjectId(userVerifyInfo.userId), userVerifyInfo.deviceId);
            return {
                status: settings_1.ResultStatus.Success,
                data: tokens
            };
        });
    },
    logoutUser(oldRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield this.ckeckUserByRefreshToken(oldRefreshToken);
            if (userVerifyInfo === null) {
                return {
                    status: settings_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            yield usersDevices_repository_1.usersDevicesRepository.deleteUserDevicebyId(userVerifyInfo.deviceId);
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(email);
            if (user === null) {
                return {
                    status: settings_1.ResultStatus.NoContent,
                    data: null
                };
            }
            const newUserRecoveryPasswordInfo = {
                recoveryCode: (0, uuid_1.v4)(),
                expirationDate: (0, add_1.add)(new Date(), {
                    hours: 1
                }),
            };
            try {
                yield email_manager_1.emailManager.sendEmailPasswordRecoveryMessage(email, newUserRecoveryPasswordInfo.recoveryCode);
            }
            catch (error) {
                console.error(error);
                return {
                    status: settings_1.ResultStatus.BadRequest,
                    data: {
                        errorsMessages: [{
                                message: "Error sending confirmation email",
                                field: "Email sender"
                            }]
                    }
                };
            }
            yield users_repository_1.usersRepository.updatePasswordRecoveryInfo(user._id, newUserRecoveryPasswordInfo);
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
    confirmPasswordRecovery(recoveryCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const recoveryInfo = yield users_query_repository_1.usersQueryRepository.findPasswordRecoveryInfo(recoveryCode);
            if (recoveryInfo === null)
                return {
                    status: settings_1.ResultStatus.BadRequest,
                    data: {
                        errorsMessages: [{
                                message: "User with current recovery code not found",
                                field: "recoveryCode"
                            }]
                    }
                };
            const errorsMessages = {
                errorsMessages: []
            };
            if (recoveryInfo !== null) {
                if (recoveryInfo.recoveryCode !== recoveryCode) {
                    errorsMessages.errorsMessages.push({
                        message: "Recovery code does not match",
                        field: "recoveryCode"
                    });
                }
                if (recoveryInfo.expirationDate < new Date()) {
                    errorsMessages.errorsMessages.push({
                        message: "Recovery code has expired, needs to be requested again",
                        field: "recoveryCode"
                    });
                }
                if (errorsMessages.errorsMessages.length !== 0) {
                    return {
                        status: settings_1.ResultStatus.BadRequest,
                        data: errorsMessages
                    };
                }
            }
            yield users_service_1.usersService.updateUserPassword(recoveryInfo.userId, newPassword);
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
};
