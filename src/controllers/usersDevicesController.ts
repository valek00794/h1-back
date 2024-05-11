import { Request, Response } from 'express'

import { ResultStatus, StatusCodes } from '../settings'
import { UsersDevicesType } from '../types/users-types'
import { UsersDevicesQueryRepository } from '../repositories/usersDevices-query-repository'
import { AuthService } from '../services/auth-service'
import { UsersDevicesService } from '../services/usersDevices-service'
export class UsersDevicesController {
    constructor(
        protected authService: AuthService,
        protected usersDevicesService: UsersDevicesService,
        protected usersDevicesQueryRepository: UsersDevicesQueryRepository) { }

    async getActiveDevicesByUserController(req: Request, res: Response<null | UsersDevicesType[]>) {
        const refreshToken = req.cookies.refreshToken
        const devicesResult = await this.usersDevicesService.getActiveDevicesByUser(refreshToken)
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

    async deleteAllDevicesByUserController(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const devicesResult = await this.usersDevicesService.deleteAllDevicesByUser(refreshToken)
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
        const refreshToken = req.cookies.refreshToken
        const devicesResult = await this.usersDevicesService.deleteUserDeviceById(refreshToken, req.params.deviceId)
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
}

