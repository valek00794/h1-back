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
exports.usersDevicesService = void 0;
const settings_1 = require("../settings");
const jwt_adapter_1 = require("../adapters/jwt/jwt-adapter");
const usersDevices_repository_1 = require("../repositories/usersDevices-repository");
const auth_service_1 = require("./auth-service");
const result_types_1 = require("../types/result-types");
class UsersDevicesService {
    addUserDevice(refreshToken, deviceTitle, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(refreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            const device = {
                deviceId: userVerifyInfo.deviceId,
                title: deviceTitle,
                userId: userVerifyInfo.userId,
                ip: ipAddress,
                lastActiveDate: new Date(userVerifyInfo.iat * 1000).toISOString(),
                expiryDate: new Date(userVerifyInfo.exp * 1000).toISOString(),
            };
            return yield usersDevices_repository_1.usersDevicesRepository.addUserDevice(device);
        });
    }
    updateUserDevice(oldRefreshToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfoByOldToken = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(oldRefreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            const userVerifyInfo = yield jwt_adapter_1.jwtAdapter.getUserInfoByToken(refreshToken, settings_1.SETTINGS.JWT.RT_SECRET);
            const newLastActiveDate = new Date(userVerifyInfo.iat * 1000).toISOString();
            const newExpiryDate = new Date(userVerifyInfo.exp * 1000).toISOString();
            return yield usersDevices_repository_1.usersDevicesRepository.updateUserDevice(userVerifyInfoByOldToken, newLastActiveDate, newExpiryDate);
        });
    }
    deleteAllDevicesByUser(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield auth_service_1.authService.checkUserByRefreshToken(refreshToken);
            if (userVerifyInfo.data === null) {
                return new result_types_1.Result(settings_1.ResultStatus.Unauthorized, null, null);
            }
            const deleteResult = yield usersDevices_repository_1.usersDevicesRepository.deleteUserDevices(userVerifyInfo.data);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, deleteResult, null);
        });
    }
    deleteUserDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield usersDevices_repository_1.usersDevicesRepository.deleteUserDevicebyId(deviceId);
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, deleteResult, null);
        });
    }
}
exports.usersDevicesService = new UsersDevicesService();
