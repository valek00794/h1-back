import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { usersService } from '../services/users-service';
import { jwtService } from '../adapters/jwt/jwt-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { TokenOutType } from '../adapters/jwt/jwt-types';
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
    if (!user) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    res
        .status(CodeResponses.OK_200)
        .send(user)
}

export const signUpController = async (req: Request, res: Response) => {
    await usersService.createUser(req.body.login, req.body.email, req.body.password, true)
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const signUpConfimationController = async (req: Request, res: Response) => {
    const isConfirmed = await usersService.confirmEmail(req.body.code)
    if (!isConfirmed) {
        res
            .status(CodeResponses.BAD_REQUEST_400)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const signUpEmailResendingController = async (req: Request, res: Response<UserInfo | false>) => {
    const inSended = await usersService.resentConfirmEmail(req.body.email)
    if (!inSended) {
        res
            .status(CodeResponses.BAD_REQUEST_400)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}
