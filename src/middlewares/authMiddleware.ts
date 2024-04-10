import { Request, Response, NextFunction } from "express"

import { SETTINGS } from "../settings"
import { ResultStatus } from "../types/result-types"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string

    if (!authHeader) {
        res
            .status(ResultStatus.UNAUTHORIZED_401)
            .send()
        return
    }

    const buff = Buffer.from(authHeader.slice(6), 'base64')
    const decodedAuth = buff.toString('utf8')

    if (authHeader && (decodedAuth === SETTINGS.ADMIN_AUTH) && (authHeader.slice(0, 6) === 'Basic ')) {
        next()
    } else {
        res
            .status(ResultStatus.UNAUTHORIZED_401)
            .send()
        return
    }
}