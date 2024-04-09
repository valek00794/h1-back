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
exports.usersQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const utils_1 = require("../utils");
exports.usersQueryRepository = {
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    },
    findUserConfirmationInfo(confirmationCodeOrUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersEmailConfirmationCollection.findOne({ $or: [{ confirmationCode: confirmationCodeOrUserId }, { userId: confirmationCodeOrUserId }] });
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const user = yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (user === null)
                return false;
            return {
                email: user.email,
                userLogin: user.login,
                userId: id
            };
        });
    },
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {
                $or: [
                    sanitizationQuery.searchLoginTerm !== null ? { login: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } : {},
                    sanitizationQuery.searchEmailTerm !== null ? { email: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}
                ]
            };
            const users = yield db_1.usersCollection
                .find(findOptions)
                .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize)
                .toArray();
            const usersCount = yield db_1.usersCollection.countDocuments(findOptions);
            return {
                pagesCount: Math.ceil(usersCount / sanitizationQuery.pageSize),
                page: sanitizationQuery.pageNumber,
                pageSize: sanitizationQuery.pageSize,
                totalCount: usersCount,
                items: users.map(user => this.mapToOutput(user))
            };
        });
    },
    mapToOutput(user) {
        return {
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },
};
