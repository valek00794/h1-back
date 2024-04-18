import { WithId } from "mongodb"

import { usersDevicesCollection } from "../db/db"
import { UsersDevicesType } from "../types/users-types"

export const usersDevicesQueryRepository = {
    async getAllActiveDevicesByUser(userId: string): Promise<UsersDevicesType[]> {
        const userDevices = await usersDevicesCollection.find({ userId }).toArray()
        return userDevices.map(device => this.mapToOutput(device))
    },

    async getUserDeviceById(deviceId: string): Promise<WithId<UsersDevicesType> | null> {
        const deviceSession = await usersDevicesCollection.findOne({ deviceId })
        return deviceSession
    },

    mapToOutput(userDevice: UsersDevicesType) {
        return {
            ip: userDevice.ip,
            title: userDevice.title,
            lastActiveDate: userDevice.lastActiveDate,
            deviceId: userDevice.deviceId,
        }
    }
}
