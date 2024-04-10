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
exports.deleteUserController = exports.getUsersController = exports.createUserController = void 0;
const users_service_1 = require("../services/users-service");
const users_query_repository_1 = require("../repositories/users-query-repository");
const result_types_1 = require("../types/result-types");
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.usersService.createUser(req.body.login, req.body.email, req.body.password);
    if (result.status === result_types_1.ResultStatus.CREATED_201) {
        res
            .status(result.status)
            .json(result.data);
        return;
    }
});
exports.createUserController = createUserController;
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const users = yield users_query_repository_1.usersQueryRepository.getAllUsers(query);
    res
        .status(result_types_1.ResultStatus.OK_200)
        .json(users);
});
exports.getUsersController = getUsersController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIsDeleted = yield users_service_1.usersService.deleteUserById(req.params.id);
    if (!userIsDeleted) {
        res
            .status(result_types_1.ResultStatus.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(result_types_1.ResultStatus.NO_CONTENT_204)
        .send();
});
exports.deleteUserController = deleteUserController;
