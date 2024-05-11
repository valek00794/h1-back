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
exports.UsersDevicesQueryRepository = void 0;
const users_types_1 = require("../types/users-types");
const usersDevices_model_1 = require("../db/mongo/usersDevices.model");
class UsersDevicesQueryRepository {
    getAllActiveDevicesByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDevices = yield usersDevices_model_1.UsersDevicesModel.find({ userId });
            return userDevices.map(device => this.mapToOutput(device));
        });
    }
    getUserDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceSession = yield usersDevices_model_1.UsersDevicesModel.findOne({ deviceId });
            return deviceSession ? this.mapToOutput(deviceSession) : null;
        });
    }
    mapToOutput(userDevice) {
        return new users_types_1.UsersDevicesOutput(userDevice.ip, userDevice.title, userDevice.deviceId, userDevice.lastActiveDate);
    }
}
exports.UsersDevicesQueryRepository = UsersDevicesQueryRepository;
