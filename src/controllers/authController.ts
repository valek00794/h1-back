import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { jwtAdapter } from '../adapters/jwt/jwt-adapter';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { TokenOutType } from '../adapters/jwt/jwt-types';
import { UserDbType, UserInfoType } from '../types/users-types';
import { APIErrorResult } from '../types/result-types';
import { ResultStatus, StatusCodes } from '../settings';
import { authService } from '../services/auth-service';
import { usersDevicesService } from '../services/usersDevices-service';

export const signInController = async (req: Request, res: Response<TokenOutType>) => {
    const user = await usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
    if (user === null) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    const checkCredential = await authService.checkCredential(user._id, req.body.password, user.passwordHash)
    if (!checkCredential) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }
    const tokens = await jwtAdapter.createJWT(user._id!)
    const deviceTitle = req.headers['user-agent'] || 'unknown device'
    const ipAddress = req.ip || '0.0.0.0'
    await usersDevicesService.addUserDevice(tokens.refreshToken, deviceTitle, ipAddress)
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, })
    res
        .status(StatusCodes.OK_200)
        .send({
            accessToken: tokens.accessToken
        })
}

export const getAuthInfoController = async (req: Request, res: Response<UserInfoType | false>) => {
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

export const signUpController = async (req: Request, res: Response<UserDbType | APIErrorResult | null>) => {
    const result = await usersService.signUpUser(req.body.login, req.body.email, req.body.password)
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

export const refreshTokenController = async (req: Request, res: Response<TokenOutType>) => {
    const oldRefreshToken = req.cookies.refreshToken
    const renewResult = await authService.renewTokens(oldRefreshToken)
    if (renewResult.status === ResultStatus.Unauthorized) {
        res
            .status(StatusCodes.UNAUTHORIZED_401)
            .send()
        return
    }

    if (renewResult.status === ResultStatus.Success) {
        await usersDevicesService.updateUserDevice(oldRefreshToken, renewResult.data!.refreshToken)
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

export const passwordRecoveryController = async (req: Request, res: Response) => {
    const result = await authService.passwordRecovery(req.body.email)
    if (result.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}

export const confirmPasswordRecoveryController = async (req: Request, res: Response<APIErrorResult | null>) => {
    const result = await authService.confirmPasswordRecovery(req.body.recoveryCode, req.body.newPassword)
    if (result.status === ResultStatus.BadRequest) {
        res
            .status(StatusCodes.BAD_REQUEST_400)
            .send(result.data)
        return
    }
    if (result.status === ResultStatus.NoContent) {
        res
            .status(StatusCodes.NO_CONTENT_204)
            .send()
        return
    }
}