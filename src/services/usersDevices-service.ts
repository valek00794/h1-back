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

    async deleteUserDeviceById(deviceId: string): Promise<Result<DeleteResult>> {
        const deleteResult = await this.usersDevicesRepository.deleteUserDevicebyId(deviceId)
        return new Result<DeleteResult>(
            ResultStatus.NoContent,
            deleteResult,
            null
        )
    }
}

