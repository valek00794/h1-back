import { DeleteResult, UpdateResult } from 'mongodb'

import { ResultStatus, SETTINGS } from '../settings'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { UsersDevicesType } from '../types/users-types'
import { Result } from '../types/result-types'
import { UsersDevicesRepository } from '../repositories/usersDevices-repository'
import { AuthService } from './auth-service'

export class UsersDevicesService {
    constructor(
        protected authService: AuthService,
        protected usersDevicesRepository: UsersDevicesRepository) { }

    async addUserDevice(refreshToken: string, deviceTitle: string, ipAddress: string): Promise<UsersDevicesType> {
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(refreshToken, SETTINGS.JWT.RT_SECRET)
        const device = {
            deviceId: userVerifyInfo!.deviceId,
            title: deviceTitle,
            userId: userVerifyInfo!.userId,
            ip: ipAddress,
            lastActiveDate: new Date(userVerifyInfo!.iat! * 1000).toISOString(),
            expiryDate: new Date(userVerifyInfo!.exp! * 1000).toISOString(),
        }
        return await this.usersDevicesRepository.addUserDevice(device)
    }

    async updateUserDevice(oldRefreshToken: string, refreshToken: string): Promise<UpdateResult<UsersDevicesType>> {
        const userVerifyInfoByOldToken = await jwtAdapter.getUserInfoByToken(oldRefreshToken, SETTINGS.JWT.RT_SECRET)
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(refreshToken, SETTINGS.JWT.RT_SECRET)
        const newLastActiveDate = new Date(userVerifyInfo!.iat! * 1000).toISOString()
        const newExpiryDate = new Date(userVerifyInfo!.exp! * 1000).toISOString()
        return await this.usersDevicesRepository.updateUserDevice(userVerifyInfoByOldToken!, newLastActiveDate, newExpiryDate)
    }

    async getActiveDevicesByUser(refreshToken: string): Promise<Result<null | UsersDevicesType[]>> {
        const userVerifyInfo = await this.authService.checkUserByRefreshToken(refreshToken)
        if (userVerifyInfo === null) {
            return new Result<null>(
                ResultStatus.Unauthorized,
                null,
                null
            )
        }
        const devices = await this.usersDevicesRepository.getAllActiveDevicesByUser(userVerifyInfo.data?.userId!)
        return new Result<UsersDevicesType[]>(
            ResultStatus.Success,
            devices,
            null
        )
    }

    async deleteAllDevicesByUser(refreshToken: string): Promise<Result<null | DeleteResult>> {
        const userVerifyInfo = await this.authService.checkUserByRefreshToken(refreshToken)
        if (userVerifyInfo.data === null) {
            return new Result<null>(
                ResultStatus.Unauthorized,
                null,
                null
            )
        }
        const deleteResult = await this.usersDevicesRepository.deleteUserDevices(userVerifyInfo.data)
        return new Result<DeleteResult>(
            ResultStatus.NoContent,
            deleteResult,
            null
        )
    }

    async deleteUserDeviceById(refreshToken: string, deviceId: string): Promise<Result<null>> {
        const userVerifyInfo = await this.authService.checkUserByRefreshToken(refreshToken)
        if (userVerifyInfo === null) {
            return new Result(
                ResultStatus.Unauthorized,
                null,
                null
            )
        }
        const device = await this.usersDevicesRepository.getUserDeviceById(deviceId)
        if (!device) {
            return new Result(
                ResultStatus.NotFound,
                null,
                null
            )
        }
        if (userVerifyInfo.data?.userId !== device.userId) {
            return new Result(
                ResultStatus.Forbidden,
                null,
                null
            )
        }
        await this.usersDevicesRepository.deleteUserDevicebyId(deviceId)
        return new Result(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}

