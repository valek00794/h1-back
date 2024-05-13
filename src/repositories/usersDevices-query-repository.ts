import { injectable } from 'inversify';

import { UsersDevicesOutput, UsersDevicesType } from "../types/users-types"
import { UsersDevicesModel } from "../db/mongo/usersDevices.model"

@injectable()
export class UsersDevicesQueryRepository {
    async getAllActiveDevicesByUser(userId: string): Promise<UsersDevicesType[]> {
        const userDevices = await UsersDevicesModel.find({ userId })
        return userDevices.map(device => this.mapToOutput(device))
    }

    async getUserDeviceById(deviceId: string): Promise<UsersDevicesType | null> {
        const deviceSession = await UsersDevicesModel.findOne({ deviceId })
        return deviceSession ? this.mapToOutput(deviceSession) : null
    }

    mapToOutput(userDevice: UsersDevicesType): UsersDevicesOutput {
        return new UsersDevicesOutput(
            userDevice.ip,
            userDevice.title,
            userDevice.deviceId,
            userDevice.lastActiveDate
        )
    }
}
