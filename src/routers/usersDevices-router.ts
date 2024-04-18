import { Router } from "express"

import { deleteAllDevicesByUserController, deleteUserDeviceByIdController, getActiveDevicesByUserController } from "../controllers/usersDevicesController"

export const usersDevicesRouter = Router()

usersDevicesRouter.get('/', getActiveDevicesByUserController)
usersDevicesRouter.delete('/', deleteAllDevicesByUserController)
usersDevicesRouter.delete('/:deviceId', deleteUserDeviceByIdController)
