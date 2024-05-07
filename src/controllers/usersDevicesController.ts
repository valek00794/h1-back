import { Request, Response } from 'express'

import { usersDevicesService } from '../services/usersDevices-service'
import { ResultStatus, StatusCodes } from '../settings'
import { UsersDevicesType } from '../types/users-types'
import { authService } from '../services/auth-service'
import { usersDevicesQueryRepository } from '../repositories/usersDevices-query-repository'

export const getActiveDevicesByUserController = async (req: Request, res: Response<null | UsersDevicesType[]>) => {
    const refreshToken = req.cookies.refreshToken
    const userVerifyInfo = await authService.ckeckUserByRefreshToken(refreshToken)
    if (userVerifyInfo === null) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    const devices = await usersDevicesQueryRepository.getAllActiveDevicesByUser(userVerifyInfo.userId)
    res
        .status(StatusCodes.OK_200)
        .send(devices)
    return
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
    const userVerifyInfo = await authService.ckeckUserByRefreshToken(req.cookies.refreshToken)
    if (userVerifyInfo === null) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    const device = await usersDevicesQueryRepository.getUserDeviceById(req.params.deviceId)
    if (device === null) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    if (userVerifyInfo.userId !== device.userId) {
        res
            .status(StatusCodes.FORBIDDEN_403)
            .send()
        return
    }
    await usersDevicesService.deleteUserDeviceById(userVerifyInfo.userId)
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
    return
}
