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
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
exports.usersRepository = {
    createUser(signUpData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield db_1.usersCollection.insertOne(signUpData.user);
            if (signUpData.emailConfirmation) {
                yield db_1.usersEmailConfirmationCollection.insertOne(Object.assign({ userId: newUser.insertedId.toString() }, signUpData.emailConfirmation));
            }
            return signUpData.user;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersEmailConfirmationCollection.deleteOne({ userId: id });
            return yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    updateUserPassword(userId, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersRecoveryPassswordCollection.deleteOne({ userId });
            return yield db_1.usersCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { passwordHash } });
        });
    },
    updateConfirmationInfo(userId, emailConfirmationInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersEmailConfirmationCollection.updateOne({ userId: userId.toString() }, { $set: Object.assign({}, emailConfirmationInfo) });
        });
    },
    updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersEmailConfirmationCollection.updateOne({ _id }, { $set: { isConfirmed: true } });
        });
    },
    updatePasswordRecoveryInfo(userId, recpveryInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersRecoveryPassswordCollection.insertOne(Object.assign({ userId: userId.toString() }, recpveryInfo));
        });
    },
};
