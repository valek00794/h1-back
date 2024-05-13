"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UsersRepository = void 0;
const inversify_1 = require("inversify");
const users_model_1 = require("../db/mongo/users.model");
const usersEmailConfirmation_model_1 = require("../db/mongo/usersEmailConfirmation.model");
const usersRecoveryPasssword_model_1 = require("../db/mongo/usersRecoveryPasssword.model");
let UsersRepository = class UsersRepository {
    createUser(signUpData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new users_model_1.UsersModel(signUpData.user);
            yield user.save();
            if (signUpData.emailConfirmation) {
                const emailConfirmation = new usersEmailConfirmation_model_1.UsersEmailConfirmationsModel(Object.assign({ userId: user._id.toString() }, signUpData.emailConfirmation));
                yield emailConfirmation.save();
            }
            return user;
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield usersEmailConfirmation_model_1.UsersEmailConfirmationsModel.deleteOne({ userId: id });
            const deleteResult = yield users_model_1.UsersModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    }
    updateUserPassword(userId, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield usersRecoveryPasssword_model_1.UsersRecoveryPassswordModel.deleteOne({ userId });
            const updatedResult = yield users_model_1.UsersModel.findByIdAndUpdate(userId, { passwordHash }, { new: true });
            return updatedResult ? true : false;
        });
    }
    updateConfirmationInfo(userId, emailConfirmationInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersEmailConfirmation_model_1.UsersEmailConfirmationsModel.updateOne({ userId: userId.toString() }, { $set: Object.assign({}, emailConfirmationInfo) });
        });
    }
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersEmailConfirmation_model_1.UsersEmailConfirmationsModel.findByIdAndUpdate(id, { isConfirmed: true }, { new: true });
        });
    }
    updatePasswordRecoveryInfo(userId, updatedRecoveryInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const recoveryInfo = new usersRecoveryPasssword_model_1.UsersRecoveryPassswordModel(Object.assign({ userId: userId.toString() }, updatedRecoveryInfo));
            yield recoveryInfo.save();
            return recoveryInfo;
        });
    }
    findUserConfirmationInfo(confirmationCodeOrUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersEmailConfirmation_model_1.UsersEmailConfirmationsModel.findOne({ $or: [{ confirmationCode: confirmationCodeOrUserId }, { userId: confirmationCodeOrUserId }] });
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_model_1.UsersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    }
    findPasswordRecoveryInfo(recoveryCodeOrUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersRecoveryPasssword_model_1.UsersRecoveryPassswordModel.findOne({ $or: [{ recoveryCode: recoveryCodeOrUserId }, { userId: recoveryCodeOrUserId }] });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_model_1.UsersModel.findById(id);
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
