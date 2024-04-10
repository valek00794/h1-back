import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { jwtService } from '../adapters/jwt/jwt-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { TokenOutType } from '../adapters/jwt/jwt-types';
import { UserInfo, UserViewType } from '../types/users-types';
import { APIErrorResult, ResultStatus } from '../types/result-types';

export const checkAuthController = async (req: Request, res: Response<TokenOutType>) => {
    const user = await usersService.checkCredential(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res
            .status(ResultStatus.UNAUTHORIZED_401)
            .send()
        return
    }
    const token = await jwtService.createJWT(user)
    res
        .status(ResultStatus.OK_200)
        .send(token)

}

export const getAuthInfoController = async (req: Request, res: Response<UserInfo | false>) => {
    if (!req.user || !req.user.userId) {
        res
            .status(ResultStatus.UNAUTHORIZED_401)
            .send()
        return
    }
    const user = await usersQueryRepository.findUserById(req.user.userId)
    if (!user) {
        res
            .status(ResultStatus.UNAUTHORIZED_401)
            .send()
        return
    }
    res
        .status(ResultStatus.OK_200)
        .send(user)
}

export const signUpController = async (req: Request, res: Response<UserViewType | APIErrorResult | null>) => {
    const result = await usersService.createUser(req.body.login, req.body.email, req.body.password, true)
    if (result.status === ResultStatus.BAD_REQUEST_400) {
        res
            .status(result.status)
            .json(result.data)
        return
    }
    if (result.status === ResultStatus.NO_CONTENT_204) {
        res
            .status(result.status)
            .json()
        return
    }
}

export const signUpConfimationController = async (req: Request, res: Response<APIErrorResult | null>) => {
    const confirmResult = await usersService.confirmEmail(req.body.code)
    if (confirmResult.status === ResultStatus.BAD_REQUEST_400) {
        res
            .status(ResultStatus.BAD_REQUEST_400)
            .send(confirmResult.data)
        return
    }
    if (confirmResult.status === ResultStatus.NO_CONTENT_204) {
        res
            .status(ResultStatus.NO_CONTENT_204)
            .send()
        return
    }
}

export const signUpEmailResendingController = async (req: Request, res: Response<APIErrorResult | null>) => {
    const sendResult = await usersService.resentConfirmEmail(req.body.email)
    if (sendResult.status === ResultStatus.BAD_REQUEST_400) {
        res
            .status(ResultStatus.BAD_REQUEST_400)
            .send(sendResult.data)
        return
    }
    if (sendResult.status === ResultStatus.NO_CONTENT_204) {
        res
            .status(ResultStatus.NO_CONTENT_204)
            .send()
        return
    }

}
