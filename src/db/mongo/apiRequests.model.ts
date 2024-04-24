import mongoose from 'mongoose'

import { SETTINGS } from '../../settings'
import { APIRequestsType } from '../../types/db-types'

export const apiRequestsSchema = new mongoose.Schema<APIRequestsType>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
})

export const ApiRequestsModel = mongoose.model<APIRequestsType>(SETTINGS.DB.collection.API_REQUESTS, apiRequestsSchema)