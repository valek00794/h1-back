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
const defaultSearchQueryParameters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchLoginTerm: null,
    searchEmailTerm: null
};
exports.usersRepository = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(user);
            return user;
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { userName: loginOrEmail }] });
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
                return false;
            }
            const user = yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (user.deletedCount === 0)
                return false;
            return true;
        });
    },
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = this.getSanitizationQuery(query);
            let findOptions = sanitizationQuery.searchLoginTerm !== null ? { name: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } :
                sanitizationQuery.searchEmailTerm !== null ? { name: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {};
            const users = yield db_1.usersCollection
                .find(findOptions)
                .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize)
                .toArray();
            const usersCount = yield db_1.usersCollection.countDocuments();
            return {
                pagesCount: Math.ceil(usersCount / defaultSearchQueryParameters.pageSize),
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
    getSanitizationQuery(query) {
        return {
            pageNumber: (query === null || query === void 0 ? void 0 : query.pageNumber) ? +query.pageNumber : defaultSearchQueryParameters.pageNumber,
            pageSize: (query === null || query === void 0 ? void 0 : query.pageSize) ? +query.pageSize : defaultSearchQueryParameters.pageSize,
            sortBy: (query === null || query === void 0 ? void 0 : query.sortBy) ? query.sortBy : defaultSearchQueryParameters.sortBy,
            sortDirection: (query === null || query === void 0 ? void 0 : query.sortDirection) ? query.sortDirection : defaultSearchQueryParameters.sortDirection,
            searchLoginTerm: (query === null || query === void 0 ? void 0 : query.searchNameTerm) ? query.searchNameTerm : defaultSearchQueryParameters.searchLoginTerm,
            searchEmailTerm: (query === null || query === void 0 ? void 0 : query.searchNameTerm) ? query.searchNameTerm : defaultSearchQueryParameters.searchEmailTerm,
        };
    }
};
