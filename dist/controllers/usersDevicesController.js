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
exports.usersDevicesController = void 0;
const usersDevices_service_1 = require("../services/usersDevices-service");
const settings_1 = require("../settings");
const auth_service_1 = require("../services/auth-service");
const usersDevices_query_repository_1 = require("../repositories/usersDevices-query-repository");
class UsersDevicesController {
    getActiveDevicesByUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const userVerifyInfo = yield auth_service_1.authService.checkUserByRefreshToken(refreshToken);
            if (userVerifyInfo.data === null) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const devices = yield usersDevices_query_repository_1.usersDevicesQueryRepository.getAllActiveDevicesByUser(userVerifyInfo.data.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .send(devices);
            return;
        });
    }
    deleteAllDevicesByUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const devicesResult = yield usersDevices_service_1.usersDevicesService.deleteAllDevicesByUser(refreshToken);
            if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            if (devicesResult.status === settings_1.ResultStatus.NoContent) {
                res
                    .status(settings_1.StatusCodes.NO_CONTENT_204)
                    .send();
                return;
            }
        });
    }
    deleteUserDeviceByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield auth_service_1.authService.checkUserByRefreshToken(req.cookies.refreshToken);
            if (userVerifyInfo.data === null) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const device = yield usersDevices_query_repository_1.usersDevicesQueryRepository.getUserDeviceById(req.params.deviceId);
            if (device === null) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            if (userVerifyInfo.data.userId !== device.userId) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
                    .send();
                return;
            }
            yield usersDevices_service_1.usersDevicesService.deleteUserDeviceById(userVerifyInfo.data.userId);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
            return;
        });
    }
}
exports.usersDevicesController = new UsersDevicesController();
