import { DeleteResult } from 'mongodb'
import { UpdateWriteOpResult } from 'mongoose'

import { UserDeviceInfoType, UsersDevicesType } from '../types/users-types'
import { UsersDevicesModel } from "../db/mongo/usersDevices.model"

class UsersDevicesRepository {
    async addUserDevice(device: UsersDevicesType) {
        const newDevice = new UsersDevicesModel(device)
        await newDevice.save()
        return newDevice
    }

    async updateUserDevice(userVerifyInfo: UserDeviceInfoType, newLastActiveDate: string, newExpiryDate: string): Promise<UpdateWriteOpResult> {
        return await UsersDevicesModel.updateOne({
            deviceId: userVerifyInfo.deviceId,
            userId: userVerifyInfo.userId,
            lastActiveDate: new Date(userVerifyInfo!.iat! * 1000).toISOString()
        }, {
            $set: {
                lastActiveDate: newLastActiveDate,
                expiryDate: newExpiryDate
            }
        })
    }

    async deleteUserDevices(userVerifyInfo: UserDeviceInfoType): Promise<DeleteResult> {
        return await UsersDevicesModel.deleteMany({
            userId: userVerifyInfo.userId,
            deviceId: { $ne: userVerifyInfo.deviceId },
            lastActiveDate: { $ne: new Date(userVerifyInfo!.iat! * 1000).toISOString() }
        })
    }

    async deleteUserDevicebyId(deviceId: string): Promise<DeleteResult> {
        return await UsersDevicesModel.deleteOne({ deviceId })
    }

    async getUserDeviceById(deviceId: string): Promise<UsersDevicesType | null> {
        return await UsersDevicesModel.findOne({ deviceId })
    }
}

export const usersDevicesRepository = new UsersDevicesRepository()
