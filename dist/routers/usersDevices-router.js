"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDevicesRouter = void 0;
const express_1 = require("express");
const usersDevicesController_1 = require("../controllers/usersDevicesController");
exports.usersDevicesRouter = (0, express_1.Router)();
exports.usersDevicesRouter.get('/', usersDevicesController_1.usersDevicesController.getActiveDevicesByUserController);
exports.usersDevicesRouter.delete('/', usersDevicesController_1.usersDevicesController.deleteAllDevicesByUserController);
exports.usersDevicesRouter.delete('/:deviceId', usersDevicesController_1.usersDevicesController.deleteUserDeviceByIdController);
