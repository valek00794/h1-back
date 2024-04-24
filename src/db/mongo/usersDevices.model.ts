import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { UsersDevicesType } from '../../types/users-types'

export const UsersDevicesSchema = new mongoose.Schema<UsersDevicesType>({
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    userId: { type: String, required: false },
    ip: { type: String, required: true },
    lastActiveDate: { type: String, required: false },
    expiryDate: { type: String, required: false },
})

export const UsersDevicesModel = mongoose.model<UsersDevicesType>(SETTINGS.DB.collection.USERS_DEVICES, UsersDevicesSchema)