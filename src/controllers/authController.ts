import { Request, Response } from 'express'

import { jwtAdapter } from '../adapters/jwt/jwt-adapter';

import { TokenOutType } from '../adapters/jwt/jwt-types';
import { UserDbType, UserInfoType } from '../types/users-types';
import { APIErrorResult } from '../types/result-types';
import { ResultStatus, StatusCodes } from '../settings';

import { AuthService } from '../services/auth-service';
import { UsersQueryRepository } from '../repositories/users-query-repository';
import { UsersService } from '../services/users-service';
import { UsersDevicesService } from '../services/usersDevices-service';

export class AuthController {
    constructor(
        protected authService: AuthService,
        protected usersService: UsersService,
        protected usersDevicesService: UsersDevicesService,
        protected usersQueryRepository: UsersQueryRepository,
    ) { }

    async signInController(req: Request, res: Response<TokenOutType>) {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
        if (user === null) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const checkCredential = await this.authService.checkCredential(user._id, req.body.password, user.passwordHash)
        if (!checkCredential) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }
        const tokens = await jwtAdapter.createJWT(user._id!)
        const deviceTitle = req.headers['user-agent'] || 'unknown device'
        const ipAddress = req.ip || '0.0.0.0'
        await this.usersDevicesService.addUserDevice(tokens.refreshToken, deviceTitle, ipAddress)
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, })
        res
            .status(StatusCodes.OK_200)
            .send({
                accessToken: tokens.accessToken
            })
    }

    async getAuthInfoController(req: Request, res: Response<UserInfoType | false>) {
        const user = await this.usersQueryRepository.findUserById(req.user!.userId)
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

    async signUpController(req: Request, res: Response<UserDbType | APIErrorResult | null>) {
        const result = await this.usersService.signUpUser(req.body.login, req.body.email, req.body.password)
        if (result.status === ResultStatus.BadRequest) {
            res
                .status(StatusCodes.BAD_REQUEST_400)
                .json(result.errors)
            return
        }
        if (result.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .json()
            return
        }
    }

    async signUpConfimationController(req: Request, res: Response<APIErrorResult | null>) {
        const confirmResult = await this.authService.confirmEmail(req.body.code)
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

    async signUpEmailResendingController(req: Request, res: Response<APIErrorResult | null>) {
        const sendResult = await this.authService.resentConfirmEmail(req.body.email)
        if (sendResult.status === ResultStatus.BadRequest) {
            res
                .status(StatusCodes.BAD_REQUEST_400)
                .send(sendResult.errors)
            return
        }
        if (sendResult.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .send()
            return
        }
    }

    async refreshTokenController(req: Request, res: Response<TokenOutType>) {
        const oldRefreshToken = req.cookies.refreshToken
        const renewResult = await this.authService.renewTokens(oldRefreshToken)
        if (renewResult.status === ResultStatus.Unauthorized) {
            res
                .status(StatusCodes.UNAUTHORIZED_401)
                .send()
            return
        }

        if (renewResult.status === ResultStatus.Success) {
            await this.usersDevicesService.updateUserDevice(oldRefreshToken, renewResult.data!.refreshToken)
            res.cookie('refreshToken', renewResult.data!.refreshToken, { httpOnly: true, secure: true, })
            res
                .status(StatusCodes.OK_200)
                .send({
                    accessToken: renewResult.data!.accessToken
                })
            return
        }
    }

    async logoutController(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const logoutResult = await this.authService.logoutUser(refreshToken)
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

    async passwordRecoveryController(req: Request, res: Response) {
        const result = await this.authService.passwordRecovery(req.body.email)
        if (result.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .send()
            return
        }
    }

    async confirmPasswordRecoveryController(req: Request, res: Response<APIErrorResult | null>) {
        const result = await this.authService.confirmPasswordRecovery(req.body.recoveryCode, req.body.newPassword)
        if (result.status === ResultStatus.BadRequest) {
            res
                .status(StatusCodes.BAD_REQUEST_400)
                .send(result.errors)
            return
        }
        if (result.status === ResultStatus.NoContent) {
            res
                .status(StatusCodes.NO_CONTENT_204)
                .send()
            return
        }
    }
}

