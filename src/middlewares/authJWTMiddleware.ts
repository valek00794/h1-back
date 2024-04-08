import { Request, Response, NextFunction } from "express"

import { jwtService } from "../adapters/jwt/jwt-service"
import { usersQueryRepository } from "../repositories/users-query-repository"
import { CodeResponses } from "../settings"

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if (!req.headers.authorization) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token!)
    if (userId) {
        if (!req.user) {
            req.user = {} as any
        }
        req.user!.userId = userId

        const user = await usersQueryRepository.findUserById(userId)
        if (user) {
            req.user!.userLogin = user.userLogin
        }
        return next()
    }
    res
        .status(CodeResponses.UNAUTHORIZED_401)
        .send()
}