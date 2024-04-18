import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import { SETTINGS } from '../../settings'
import { JWTTokensOutType } from './jwt-types'
import { UserDeviceInfoType } from '../../types/users-types'


export const jwtAdapter = {
    async createJWT(userId: ObjectId, deviceId?: string): Promise<JWTTokensOutType> {
        const accessToken = jwt.sign({ userId }, SETTINGS.JWT.AT_SECRET, { expiresIn: SETTINGS.JWT.AT_EXPIRES_TIME })
        const getDeviceId = deviceId ? deviceId : uuidv4()
        const refreshToken = jwt.sign({ userId, deviceId: getDeviceId }, SETTINGS.JWT.RT_SECRET, { expiresIn: SETTINGS.JWT.RT_EXPIRES_TIME })
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    },

    async getUserInfoByToken(token: string, secret: string): Promise<UserDeviceInfoType | null> {
        try {
            const res = jwt.verify(token, secret)
            if (typeof res !== 'string') {
                return { userId: res.userId, deviceId: res.deviceId, iat: res.iat, exp: res.exp }
            }
        } catch (error) {
            console.error('Token verify error')
        }
        return null
    }
}