import jwt from 'jsonwebtoken'

import { UserDbViewType } from '../../types/users-types'
import { SETTINGS } from '../../settings'
import { TokenOutType } from './jwt-types'

export const jwtService = {
    async createJWT(user: UserDbViewType): Promise<TokenOutType> {
        const token = jwt.sign({ userId: user._id }, SETTINGS.JWT.SECRET, { expiresIn: SETTINGS.JWT.EXPIRES_TIME })
        return {
            accessToken: token
        }
    }
    ,
    async getUserIdByToken(token: string){
        try {
            const res = jwt.verify(token, SETTINGS.JWT.SECRET)
            if (typeof res !== 'string') {
                return res.userId
            }
        } catch (error) {
            return null
        }
    }
}