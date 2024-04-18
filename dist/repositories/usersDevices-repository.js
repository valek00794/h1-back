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
exports.usersDevicesRepository = void 0;
const db_1 = require("../db/db");
exports.usersDevicesRepository = {
    addUserDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersDevicesCollection.insertOne(device);
            return device;
        });
    },
    updateUserDevice(userVerifyInfo, newLastActiveDate, newExpiryDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersDevicesCollection.updateOne({
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
    },
    deleteUserDevices(userVerifyInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersDevicesCollection.deleteMany({
                userId: userVerifyInfo.userId,
                deviceId: { $ne: userVerifyInfo.deviceId },
                lastActiveDate: { $ne: new Date(userVerifyInfo.iat * 1000).toISOString() }
            });
        });
    },
    deleteUserDevicebyId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersDevicesCollection.deleteOne({ deviceId });
        });
    },
};
