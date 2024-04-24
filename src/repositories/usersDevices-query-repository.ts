import { UsersDevicesType } from "../types/users-types"
import { UsersDevicesModel } from "../db/mongo/usersDevices.model"

export const usersDevicesQueryRepository = {
    async getAllActiveDevicesByUser(userId: string): Promise<UsersDevicesType[]> {
        const userDevices = await UsersDevicesModel.find({ userId })
        return userDevices.map(device => this.mapToOutput(device))
    },

    async getUserDeviceById(deviceId: string): Promise<UsersDevicesType | false> {
        const deviceSession = await UsersDevicesModel.findOne({deviceId})
        return deviceSession ? this.mapToOutput(deviceSession) : false
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
