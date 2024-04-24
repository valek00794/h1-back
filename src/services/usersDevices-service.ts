import { DeleteResult, UpdateResult } from 'mongodb'

import { ResultStatus, SETTINGS } from '../settings'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { usersDevicesRepository } from '../repositories/usersDevices-repository'
import { UsersDevicesType } from '../types/users-types'
import { authService } from './auth-service'
import { usersDevicesQueryRepository } from '../repositories/usersDevices-query-repository'
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
    async getActiveDevicesByUser(refreshToken: string): Promise<Result<null | UsersDevicesType[]>> {
        const userVerifyInfo = await authService.ckeckUserByRefreshToken(refreshToken)
        if (userVerifyInfo === null) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        const devices = await usersDevicesQueryRepository.getAllActiveDevicesByUser(userVerifyInfo.userId)
        return {
            status: ResultStatus.Success,
            data: devices
        }
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
    async deleteUserDeviceById(refreshToken: string, deviceId: string): Promise<Result<null | DeleteResult>> {
        const userVerifyInfo = await authService.ckeckUserByRefreshToken(refreshToken)
        if (userVerifyInfo === null) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        const device = await usersDevicesQueryRepository.getUserDeviceById(deviceId)
        if (!device) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        if (userVerifyInfo.userId !== device.userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }
        const deleteResult = await usersDevicesRepository.deleteUserDevicebyId(deviceId)
        return {
            status: ResultStatus.NoContent,
            data: deleteResult
        }
    }
}
