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
exports.deleteUserDeviceByIdController = exports.deleteAllDevicesByUserController = exports.getActiveDevicesByUserController = void 0;
const usersDevices_service_1 = require("../services/usersDevices-service");
const settings_1 = require("../settings");
const getActiveDevicesByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const devicesResult = yield usersDevices_service_1.usersDevicesService.getActiveDevicesByUser(refreshToken);
    if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    if (devicesResult.status === settings_1.ResultStatus.Success) {
        res
            .status(settings_1.StatusCodes.OK_200)
            .send(devicesResult.data);
        return;
    }
});
exports.getActiveDevicesByUserController = getActiveDevicesByUserController;
const deleteAllDevicesByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteAllDevicesByUserController = deleteAllDevicesByUserController;
const deleteUserDeviceByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const devicesResult = yield usersDevices_service_1.usersDevicesService.deleteUserDeviceById(refreshToken, req.params.deviceId);
    if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    if (devicesResult.status === settings_1.ResultStatus.NotFound) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    if (devicesResult.status === settings_1.ResultStatus.Forbidden) {
        res
            .status(settings_1.StatusCodes.FORBIDDEN_403)
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
exports.deleteUserDeviceByIdController = deleteUserDeviceByIdController;
