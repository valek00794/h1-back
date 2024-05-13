import { Request, Response, NextFunction } from "express"

import { jwtAdapter } from "../adapters/jwt/jwt-adapter"
import { SETTINGS } from "../settings"
import { UserInfo } from "../types/users-types"

export const userIdFromJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(token!, SETTINGS.JWT.AT_SECRET)
        if (userVerifyInfo) {
            if (!req.user) {
                req.user = {} as UserInfo
            }
            req.user!.userId = userVerifyInfo.userId
        }
    }
    return next()
}