import { Request, Response } from 'express'

import { usersDevicesService } from '../services/usersDevices-service'
import { ResultStatus, StatusCodes } from '../settings'
import { UsersDevicesType } from '../types/users-types'

export const getActiveDevicesByUserController = async (req: Request, res: Response<null | UsersDevicesType[]>) => {
    const refreshToken = req.cookies.refreshToken
    const devicesResult = await usersDevicesService.getActiveDevicesByUser(refreshToken)
    if (devicesResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    if (devicesResult.status === ResultStatus.Success) {
        res
            .status(StatusCodes.OK_200)
            .send(devicesResult.data)
        return
    }
}

export const deleteAllDevicesByUserController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const devicesResult = await usersDevicesService.deleteAllDevicesByUser(refreshToken)
    if (devicesResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    if (devicesResult.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}

export const deleteUserDeviceByIdController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const devicesResult = await usersDevicesService.deleteUserDeviceById(refreshToken, req.params.deviceId)
    if (devicesResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    if (devicesResult.status === ResultStatus.NotFound) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    if (devicesResult.status === ResultStatus.Forbidden) {
        res
            .status(StatusCodes.FORBIDDEN_403)
            .send()
        return
    }
    if (devicesResult.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}
