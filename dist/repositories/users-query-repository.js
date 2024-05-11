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
exports.UsersQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const users_types_1 = require("../types/users-types");
const utils_1 = require("../utils");
const users_model_1 = require("../db/mongo/users.model");
const result_types_1 = require("../types/result-types");
class UsersQueryRepository {
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const user = yield users_model_1.UsersModel.findById(id);
            return user ? {
                email: user.email,
                login: user.login,
                userId: id
            }
                : false;
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_model_1.UsersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    }
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {
                $or: [
                    sanitizationQuery.searchLoginTerm !== null ? { login: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } : {},
                    sanitizationQuery.searchEmailTerm !== null ? { email: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}
                ]
            };
            const users = yield users_model_1.UsersModel
                .find(findOptions)
                .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize);
            const usersCount = yield users_model_1.UsersModel.countDocuments(findOptions);
            return new result_types_1.Paginator(sanitizationQuery.pageNumber, sanitizationQuery.pageSize, usersCount, users.map(user => this.mapToOutput(user)));
        });
    }
    mapToOutput(user) {
        return new users_types_1.UserView(user._id, user.login, user.email, user.createdAt);
    }
}
exports.UsersQueryRepository = UsersQueryRepository;
