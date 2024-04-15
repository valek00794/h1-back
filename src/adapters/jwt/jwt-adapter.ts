import jwt, { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { SETTINGS } from '../../settings'
import { JWTTokensOutType } from './jwt-types'


export const jwtAdapter = {
    async createJWT(userId: ObjectId): Promise<JWTTokensOutType> {
        const accessToken = jwt.sign({ userId }, SETTINGS.JWT.AT_SECRET, { expiresIn: SETTINGS.JWT.AT_EXPIRES_TIME })
        const refreshToken = jwt.sign({ userId }, SETTINGS.JWT.RT_SECRET, { expiresIn: SETTINGS.JWT.RT_EXPIRES_TIME })
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    },

    async getUserIdByToken(token: string, secret: string): Promise<string | null> {
        try {
            const res = jwt.verify(token, secret)
            if (typeof res !== 'string') {
                return res.userId
            }
        } catch (error) {
            console.error('Token verify error') 
        }
        return null
    }
}