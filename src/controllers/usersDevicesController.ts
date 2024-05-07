import { Request, Response } from 'express'

import { usersDevicesService } from '../services/usersDevices-service'
import { ResultStatus, StatusCodes } from '../settings'
import { UsersDevicesType } from '../types/users-types'
import { authService } from '../services/auth-service'
import { usersDevicesQueryRepository } from '../repositories/usersDevices-query-repository'
class UsersDevicesController {
    async getActiveDevicesByUserController(req: Request, res: Response<null | UsersDevicesType[]>) {
        const refreshToken = req.cookies.refreshToken
        const userVerifyInfo = await authService.checkUserByRefreshToken(refreshToken)
        if (userVerifyInfo.data === null) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const devices = await usersDevicesQueryRepository.getAllActiveDevicesByUser(userVerifyInfo.data.userId)
        res
            .status(StatusCodes.OK_200)
            .send(devices)
        return
    }

    async deleteAllDevicesByUserController(req: Request, res: Response) {
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

    async deleteUserDeviceByIdController(req: Request, res: Response) {
        const userVerifyInfo = await authService.checkUserByRefreshToken(req.cookies.refreshToken)
        if (userVerifyInfo.data === null) {
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
        if (userVerifyInfo.data.userId !== device.userId) {
            res
                .status(StatusCodes.FORBIDDEN_403)
                .send()
            return
        }
        await usersDevicesService.deleteUserDeviceById(userVerifyInfo.data.userId)
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}

export const usersDevicesController = new UsersDevicesController()