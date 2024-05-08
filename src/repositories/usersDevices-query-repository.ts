import { UsersDevicesType } from "../types/users-types"
import { UsersDevicesModel } from "../db/mongo/usersDevices.model"

class UsersDevicesQueryRepository {
    async getAllActiveDevicesByUser(userId: string): Promise<UsersDevicesType[]> {
        const userDevices = await UsersDevicesModel.find({ userId })
        return userDevices.map(device => this.mapToOutput(device))
    }

    async getUserDeviceById(deviceId: string): Promise<UsersDevicesType | null> {
        const deviceSession = await UsersDevicesModel.findOne({ deviceId })
        return deviceSession ? this.mapToOutput(deviceSession) : null
    }

    mapToOutput(userDevice: UsersDevicesType) {
        return {
            ip: userDevice.ip,
            title: userDevice.title,
            lastActiveDate: userDevice.lastActiveDate,
            deviceId: userDevice.deviceId,
        }
    }
}

export const usersDevicesQueryRepository = new UsersDevicesQueryRepository()
