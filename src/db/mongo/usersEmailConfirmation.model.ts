import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { UserEmailConfirmationInfoType } from '../../types/users-types'

export const usersEmailConfirmationsSchema = new mongoose.Schema<UserEmailConfirmationInfoType>({
    userId: { type: String, required: false },
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
})

export const UsersEmailConfirmationsModel = mongoose.model<UserEmailConfirmationInfoType>(SETTINGS.DB.collection.USERS_EMAIL_CONFIRMATIONS, usersEmailConfirmationsSchema)