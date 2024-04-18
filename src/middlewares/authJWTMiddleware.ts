import { Request, Response, NextFunction } from "express"

import { jwtAdapter } from "../adapters/jwt/jwt-adapter"
import { usersQueryRepository } from "../repositories/users-query-repository"
import { SETTINGS, StatusCodes } from "../settings"
import { UserInfoType } from "../types/users-types"

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
            req.user = {} as UserInfoType 
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