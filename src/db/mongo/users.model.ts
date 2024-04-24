import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { UserType } from '../../types/users-types'

export const UsersSchema = new mongoose.Schema<UserType>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordHash: { type: String, required: true },
})

export const UsersModel = mongoose.model<UserType>(SETTINGS.DB.collection.USERS, UsersSchema)