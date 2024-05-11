import { Request, Response, NextFunction } from "express"

import { jwtAdapter } from "../adapters/jwt/jwt-adapter"
import { SETTINGS, StatusCodes } from "../settings"
import { UserInfo } from "../types/users-types"
import { usersQueryRepository } from "../composition-root"

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userVerifyInfo = await jwtAdapter.getUserInfoByToken(token!, SETTINGS.JWT.AT_SECRET)
    if (userVerifyInfo) {
        if (!req.user) {
            req.user = {} as UserInfo
        }
        req.user!.userId = userVerifyInfo.userId

        const user = await usersQueryRepository.findUserById(userVerifyInfo.userId)
        if (user) {
            req.user!.login = user.login
        }
        return next()
    }
    res
        .status(StatusCodes.UNAUTHORIZED_401)
        .send()
}