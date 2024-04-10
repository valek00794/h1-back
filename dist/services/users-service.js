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
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = require("date-fns/add");
const users_query_repository_1 = require("../repositories/users-query-repository");
const users_repository_1 = require("../repositories/users-repository");
const email_manager_1 = require("../managers/email-manager");
const result_types_1 = require("../types/result-types");
exports.usersService = {
    createUser(login, email, password, requireConfirmation) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const signUpData = {
                user: {
                    login,
                    email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                },
                emailConfirmation: false
            };
            if (requireConfirmation) {
                signUpData.emailConfirmation = {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.add)(new Date(), {
                        hours: 1
                    }),
                    isConfirmed: false
                };
            }
            const createdUser = yield users_repository_1.usersRepository.createUser(signUpData);
            if (signUpData.emailConfirmation) {
                try {
                    yield email_manager_1.emailManager.sendEmailConfirmationMessage(signUpData.user.email, signUpData.emailConfirmation.confirmationCode);
                }
                catch (error) {
                    console.error(error);
                    users_repository_1.usersRepository.deleteUserById(createdUser._id.toString());
                    return {
                        status: result_types_1.ResultStatus.BAD_REQUEST_400,
                        data: {
                            errorsMessages: [{
                                    message: "Error sending confirmation email",
                                    field: "Email sender"
                                }]
                        }
                    };
                }
            }
            if (requireConfirmation) {
                return {
                    status: result_types_1.ResultStatus.NO_CONTENT_204,
                    data: null
                };
            }
            return {
                status: result_types_1.ResultStatus.CREATED_201,
                data: users_query_repository_1.usersQueryRepository.mapToOutput(createdUser),
            };
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    },
    checkCredential(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
            if (user === null)
                return false;
            const userConfirmationInfo = yield users_query_repository_1.usersQueryRepository.findUserConfirmationInfo(user._id.toString());
            if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed)
                return false;
            const isAuth = yield bcrypt_1.default.compare(password, user.passwordHash);
            return isAuth ? user : false;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const res = yield users_repository_1.usersRepository.deleteUserById(id);
            if (res.deletedCount === 0)
                return false;
            return true;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConfirmationInfo = yield users_query_repository_1.usersQueryRepository.findUserConfirmationInfo(code);
            const errorsMessages = {
                errorsMessages: []
            };
            if (userConfirmationInfo === null) {
                errorsMessages.errorsMessages.push({
                    message: "User with current confirmation code not found",
                    field: "code"
                });
            }
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
                        status: result_types_1.ResultStatus.BAD_REQUEST_400,
                        data: errorsMessages
                    };
                }
            }
            yield users_repository_1.usersRepository.updateConfirmation(userConfirmationInfo._id);
            return {
                status: result_types_1.ResultStatus.NO_CONTENT_204,
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
                    status: result_types_1.ResultStatus.BAD_REQUEST_400,
                    data: errorsMessages
                };
            }
            yield users_repository_1.usersRepository.updateConfirmationInfo(user._id, newUserConfirmationInfo);
            return {
                status: result_types_1.ResultStatus.NO_CONTENT_204,
                data: null
            };
        });
    },
};
