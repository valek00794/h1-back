"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDevicesRouter = void 0;
const express_1 = require("express");
const composition_root_1 = require("../composition-root");
exports.usersDevicesRouter = (0, express_1.Router)();
exports.usersDevicesRouter.get('/', composition_root_1.usersDevicesController.getActiveDevicesByUserController.bind(composition_root_1.usersDevicesController));
exports.usersDevicesRouter.delete('/', composition_root_1.usersDevicesController.deleteAllDevicesByUserController.bind(composition_root_1.usersDevicesController));
exports.usersDevicesRouter.delete('/:deviceId', composition_root_1.usersDevicesController.deleteUserDeviceByIdController.bind(composition_root_1.usersDevicesController));
