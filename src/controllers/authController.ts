import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { jwtAdapter } from '../adapters/jwt/jwt-adapter';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { TokenOutType } from '../adapters/jwt/jwt-types';
import { UserInfo, UserViewType } from '../types/users-types';
import { APIErrorResult } from '../types/result-types';
import { ResultStatus, StatusCodes } from '../settings';
import { authService } from '../services/auth-service';

export const signInController = async (req: Request, res: Response<TokenOutType>) => {
    const user = await authService.checkCredential(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    const tokens = await jwtAdapter.createJWT(user._id!)
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, })
    res
        .status(StatusCodes.OK_200)
        .send({
            accessToken: tokens.accessToken
        })
}

export const getAuthInfoController = async (req: Request, res: Response<UserInfo | false>) => {
    const user = await usersQueryRepository.findUserById(req.user!.userId)
    if (!req.user || !req.user.userId || !user) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    res
        .status(StatusCodes.OK_200)
        .send(user)
}

export const signUpController = async (req: Request, res: Response<UserViewType | APIErrorResult | null>) => {
    const result = await usersService.createUser(req.body.login, req.body.email, req.body.password, true)
    if (result.status === ResultStatus.BadRequest) {
        res
            .status(StatusCodes.BAD_REQUEST_400)
            .json(result.data)
        return
    }
    if (result.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .json()
        return
    }
}

export const signUpConfimationController = async (req: Request, res: Response<APIErrorResult | null>) => {
    const confirmResult = await authService.confirmEmail(req.body.code)
    if (confirmResult.status === ResultStatus.BadRequest) {
        res
            .status(StatusCodes.BAD_REQUEST_400)
            .send(confirmResult.data)
        return
    }
    if (confirmResult.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}

export const signUpEmailResendingController = async (req: Request, res: Response<APIErrorResult | null>) => {
    const sendResult = await authService.resentConfirmEmail(req.body.email)
    if (sendResult.status === ResultStatus.BadRequest) {
        res
            .status(StatusCodes.BAD_REQUEST_400)
            .send(sendResult.data)
        return
    }
    if (sendResult.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const renewResult = await authService.renewTokens(refreshToken)
    if (renewResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    if (renewResult.status === ResultStatus.Success) {
        res.cookie('refreshToken', renewResult.data!.refreshToken, { httpOnly: true, secure: true, })
        res
            .status(StatusCodes.OK_200)
            .send({
                accessToken: renewResult.data!.accessToken
            })
        return
    }
}

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const logoutResult = await authService.logoutUser(refreshToken)
    if (logoutResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    if (logoutResult.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}