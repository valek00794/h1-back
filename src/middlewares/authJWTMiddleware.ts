import { Request, Response, NextFunction } from "express"

import { jwtAdapter } from "../adapters/jwt/jwt-adapter"
import { usersQueryRepository } from "../repositories/users-query-repository"
import { SETTINGS, StatusCodes } from "../settings"
import { UserInfo } from "../types/users-types"

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookie_refresh_token = req.cookies.refreshToken
    if (!req.headers.authorization) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtAdapter.getUserIdByToken(token!, SETTINGS.JWT.AT_SECRET)
    if (userId) {
        if (!req.user) {
            req.user = {} as UserInfo 
        }
        req.user!.userId = userId

        const user = await usersQueryRepository.findUserById(userId)
        if (user) {
            req.user!.login = user.login
        }
        return next()
    }
    res
        .status(StatusCodes.UNAUTHORIZED_401)
        .send()
}