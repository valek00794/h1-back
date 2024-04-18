import { DeleteResult, UpdateResult } from "mongodb"

import { usersDevicesCollection } from "../db/db"
import { UserDeviceInfoType, UsersDevicesType } from '../types/users-types'

export const usersDevicesRepository = {
    async addUserDevice(device: UsersDevicesType) {
        await usersDevicesCollection.insertOne(device)
        return device
    },
    async updateUserDevice(userVerifyInfo: UserDeviceInfoType, newLastActiveDate: string, newExpiryDate: string): Promise<UpdateResult<UsersDevicesType>> {
        return await usersDevicesCollection.updateOne({
            deviceId: userVerifyInfo.deviceId,
            userId: userVerifyInfo.userId,
            lastActiveDate: new Date(userVerifyInfo!.iat! * 1000).toISOString()
        }, {
            $set: {
                lastActiveDate: newLastActiveDate,
                expiryDate: newExpiryDate
            }
        })
    },

    async deleteUserDevices(userVerifyInfo: UserDeviceInfoType): Promise<DeleteResult> {
        return await usersDevicesCollection.deleteMany({
            userId: userVerifyInfo.userId,
            deviceId: { $ne: userVerifyInfo.deviceId },
            lastActiveDate: { $ne: new Date(userVerifyInfo!.iat! * 1000).toISOString() }
        })
    },

    async deleteUserDevicebyId(deviceId: string): Promise<DeleteResult> {
        return await usersDevicesCollection.deleteOne({ deviceId })
    },
}
