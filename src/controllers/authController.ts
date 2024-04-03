import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { usersService } from '../services/users-service';
import { jwtService } from '../application/jwt/jwt-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { TokenOutType } from '../application/jwt/jwt-types';
import { UserInfo } from '../types/users-types';

export const checkAuthController = async (req: Request, res: Response<TokenOutType>) => {
    const user = await usersService.checkCredential(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    const token = await jwtService.createJWT(user)
    res
        .status(CodeResponses.OK_200)
        .send(token)
}

export const getAuthInfoController = async (req: Request, res: Response<UserInfo | false>) => {
    if (!req.user || !req.user.userId) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    const user = await usersQueryRepository.findUserById(req.user.userId)
    res
        .status(CodeResponses.OK_200)
        .send(user)
}