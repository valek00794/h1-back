import { Router } from "express"
import { usersDevicesController } from "../composition-root"

export const usersDevicesRouter = Router()

usersDevicesRouter.get('/', usersDevicesController.getActiveDevicesByUserController.bind(usersDevicesController))
usersDevicesRouter.delete('/', usersDevicesController.deleteAllDevicesByUserController.bind(usersDevicesController))
usersDevicesRouter.delete('/:deviceId', usersDevicesController.deleteUserDeviceByIdController.bind(usersDevicesController))
