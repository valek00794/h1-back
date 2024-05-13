import { Router } from "express"
import { container } from "../composition-root"
import { UsersDevicesController } from "../controllers/usersDevicesController"

const usersDevicesController = container.resolve(UsersDevicesController)
export const usersDevicesRouter = Router()

usersDevicesRouter.get('/', usersDevicesController.getActiveDevicesByUserController.bind(usersDevicesController))
usersDevicesRouter.delete('/', usersDevicesController.deleteAllDevicesByUserController.bind(usersDevicesController))
usersDevicesRouter.delete('/:deviceId', usersDevicesController.deleteUserDeviceByIdController.bind(usersDevicesController))
