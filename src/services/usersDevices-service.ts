import { DeleteResult, UpdateResult } from 'mongodb'

import { ResultStatus, SETTINGS } from '../settings'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { usersDevicesRepository } from '../repositories/usersDevices-repository'
import { UsersDevicesType } from '../types/users-types'
import { authService } from './auth-service'
import { Result } from '../types/result-types'

export const usersDevicesService = {
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
        return await usersDevicesRepository.addUserDevice(device)
    },
    async updateUserDevice(oldRefreshToken: string, refreshToken: string): Promise<UpdateResult<UsersDevicesType>> {
        const userVerifyInfoByOldToken = await jwtAdapter.getUserInfoByToken(oldRefreshToken, SETTINGS.JWT.RT_SECRET)
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(refreshToken, SETTINGS.JWT.RT_SECRET)
        const newLastActiveDate = new Date(userVerifyInfo!.iat! * 1000).toISOString()
        const newExpiryDate = new Date(userVerifyInfo!.exp! * 1000).toISOString()
        return await usersDevicesRepository.updateUserDevice(userVerifyInfoByOldToken!, newLastActiveDate, newExpiryDate)
    },

    async deleteAllDevicesByUser(refreshToken: string): Promise<Result<null | DeleteResult>> {
        const userVerifyInfo = await authService.ckeckUserByRefreshToken(refreshToken)
        if (userVerifyInfo === null) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        const deleteResult = await usersDevicesRepository.deleteUserDevices(userVerifyInfo)
        return {
            status: ResultStatus.NoContent,
            data: deleteResult
        }
    },
    async deleteUserDeviceById(deviceId: string): Promise<Result<DeleteResult>> {
        const deleteResult = await usersDevicesRepository.deleteUserDevicebyId(deviceId)
        return {
            status: ResultStatus.NoContent,
            data: deleteResult
        }
    }
}
