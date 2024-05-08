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
}
exports.UsersService = UsersService;
