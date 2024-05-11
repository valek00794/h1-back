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
exports.UsersService = void 0;
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const add_1 = require("date-fns/add");
const email_manager_1 = require("../managers/email-manager");
const result_types_1 = require("../types/result-types");
const settings_1 = require("../settings");
const bcypt_adapter_1 = require("../adapters/bcypt-adapter");
class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    signUpUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcypt_adapter_1.bcryptArapter.generateHash(password);
            const signUpData = {
                user: {
                    login,
                    email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.add)(new Date(), {
                        hours: 1
                    }),
                    isConfirmed: false
                }
            };
            const createdUser = yield this.usersRepository.createUser(signUpData);
            if (signUpData.emailConfirmation) {
                try {
                    yield email_manager_1.emailManager.sendEmailConfirmationMessage(signUpData.user.email, signUpData.emailConfirmation.confirmationCode);
                }
                catch (error) {
                    console.error(error);
                    this.usersRepository.deleteUserById(createdUser._id.toString());
                    const errors = {
                        errorsMessages: [{
                                message: "Error sending confirmation email",
                                field: "Email sender"
                            }]
                    };
                    return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
                }
            }
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcypt_adapter_1.bcryptArapter.generateHash(password);
            const signUpData = {
                user: {
                    login,
                    email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                },
                emailConfirmation: false
            };
            return yield this.usersRepository.createUser(signUpData);
        });
    }
    updateUserPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(userId)) {
                return false;
            }
            const passwordHash = yield bcypt_adapter_1.bcryptArapter.generateHash(password);
            return yield this.usersRepository.updateUserPassword(userId, passwordHash);
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            return yield this.usersRepository.deleteUserById(id);
        });
    }
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByLoginOrEmail(email);
            if (user === null) {
                return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
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
                const errors = {
                    errorsMessages: []
                };
                errors.errorsMessages.push({
                    message: "Error sending recovery email",
                    field: "Email sender"
                });
                return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
            }
            yield this.usersRepository.updatePasswordRecoveryInfo(user._id, newUserRecoveryPasswordInfo);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
    confirmPasswordRecovery(recoveryCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const recoveryInfo = yield this.usersRepository.findPasswordRecoveryInfo(recoveryCode);
            const errors = {
                errorsMessages: []
            };
            if (recoveryInfo === null) {
                errors.errorsMessages.push({
                    message: "User with current recovery code not found",
                    field: "recoveryCode"
                });
                return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
            }
            if (recoveryInfo !== null) {
                if (recoveryInfo.recoveryCode !== recoveryCode) {
                    errors.errorsMessages.push({
                        message: "Recovery code does not match",
                        field: "recoveryCode"
                    });
                }
                if (recoveryInfo.expirationDate < new Date()) {
                    errors.errorsMessages.push({
                        message: "Recovery code has expired, needs to be requested again",
                        field: "recoveryCode"
                    });
                }
                if (errors.errorsMessages.length !== 0) {
                    return new result_types_1.Result(settings_1.ResultStatus.BadRequest, null, errors);
                }
            }
            yield this.updateUserPassword(recoveryInfo.userId, newPassword);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
}
exports.UsersService = UsersService;
