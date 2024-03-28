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
exports.checkAuthController = void 0;
const settings_1 = require("../settings");
const users_service_1 = require("../services/users-service");
const checkAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuth = yield users_service_1.usersService.checkCredential(req.body.loginOrEmail, req.body.password);
    if (!isAuth) {
        res
            .status(settings_1.CodeResponses.UNAUTHORIZED_401)
            .send();
        return;
    }
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
});
exports.checkAuthController = checkAuthController;
