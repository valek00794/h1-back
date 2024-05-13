"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UsersDevicesRepository = void 0;
const inversify_1 = require("inversify");
const usersDevices_model_1 = require("../db/mongo/usersDevices.model");
let UsersDevicesRepository = class UsersDevicesRepository {
    addUserDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDevice = new usersDevices_model_1.UsersDevicesModel(device);
            yield newDevice.save();
            return newDevice;
        });
    }
    updateUserDevice(userVerifyInfo, newLastActiveDate, newExpiryDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersDevices_model_1.UsersDevicesModel.updateOne({
                deviceId: userVerifyInfo.deviceId,
                userId: userVerifyInfo.userId,
                lastActiveDate: new Date(userVerifyInfo.iat * 1000).toISOString()
            }, {
                $set: {
                    lastActiveDate: newLastActiveDate,
                    expiryDate: newExpiryDate
                }
            });
        });
    }
    deleteUserDevices(userVerifyInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersDevices_model_1.UsersDevicesModel.deleteMany({
                userId: userVerifyInfo.userId,
                deviceId: { $ne: userVerifyInfo.deviceId },
                lastActiveDate: { $ne: new Date(userVerifyInfo.iat * 1000).toISOString() }
            });
        });
    }
    deleteUserDevicebyId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersDevices_model_1.UsersDevicesModel.deleteOne({ deviceId });
        });
    }
    getUserDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersDevices_model_1.UsersDevicesModel.findOne({ deviceId });
        });
    }
    getAllActiveDevicesByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersDevices_model_1.UsersDevicesModel.find({ userId });
        });
    }
};
exports.UsersDevicesRepository = UsersDevicesRepository;
exports.UsersDevicesRepository = UsersDevicesRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersDevicesRepository);
