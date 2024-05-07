import { Router } from "express"

import { usersDevicesController } from "../controllers/usersDevicesController"

export const usersDevicesRouter = Router()

usersDevicesRouter.get('/', usersDevicesController.getActiveDevicesByUserController)
usersDevicesRouter.delete('/', usersDevicesController.deleteAllDevicesByUserController)
usersDevicesRouter.delete('/:deviceId', usersDevicesController.deleteUserDeviceByIdController)
