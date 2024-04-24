import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { UserRecoveryPasswordInfoType } from '../../types/users-types'

export const usersRecoveryPassswordSchema = new mongoose.Schema<UserRecoveryPasswordInfoType>({
    userId: { type: String, required: false },
    expirationDate: { type: Date, required: true },
    recoveryCode: { type: String, required: true },
})

export const UsersRecoveryPassswordModel = mongoose.model<UserRecoveryPasswordInfoType>(SETTINGS.DB.collection.USERS_PASSWORD_RECOVERY, usersRecoveryPassswordSchema)