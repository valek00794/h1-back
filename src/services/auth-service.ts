import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDbViewType, UserDeviceInfoType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus, SETTINGS } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { ObjectId } from 'mongodb'
import { JWTTokensOutType } from '../adapters/jwt/jwt-types'
import { usersDevicesQueryRepository } from '../repositories/usersDevices-query-repository'
import { usersDevicesRepository } from '../repositories/usersDevices-repository'

export const authService = {
    async checkCredential(loginOrEmail: string, password: string): Promise<false | UserDbViewType> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (user === null) return false
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(user._id!.toString())
        if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed) return false
        const isAuth = await bcryptArapter.checkPassword(password, user.passwordHash)
        return isAuth ? user : false
    },

    async confirmEmail(code: string): Promise<Result<APIErrorResult | null>> {
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(code)
        if (userConfirmationInfo === null) return {
            status: ResultStatus.BadRequest,
            data: {
                errorsMessages: [{
                    message: "User with current confirmation code not found",
                    field: "code"
                }]
            }
        }
        const errorsMessages: APIErrorResult = {
            errorsMessages: []
        }
        if (userConfirmationInfo !== null) {
            if (userConfirmationInfo.isConfirmed) {
                errorsMessages.errorsMessages.push({
                    message: "User with current confirmation code already confirmed",
                    field: "code"
                })
            }
            if (userConfirmationInfo.confirmationCode !== code) {
                errorsMessages.errorsMessages.push({
                    message: "Verification code does not match",
                    field: "code"
                })
            }
            if (userConfirmationInfo.expirationDate < new Date()) {
                errorsMessages.errorsMessages.push({
                    message: "Verification code has expired, needs to be requested again",
                    field: "code"
                })
            }
            if (errorsMessages.errorsMessages.length !== 0) {
                return {
                    status: ResultStatus.BadRequest,
                    data: errorsMessages
                }
            }
        }
        await usersRepository.updateConfirmation(userConfirmationInfo!._id)
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
    async resentConfirmEmail(email: string): Promise<Result<APIErrorResult | null>> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(email)
        const errorsMessages: APIErrorResult = {
            errorsMessages: []
        }
        if (user === null) {
            errorsMessages.errorsMessages.push({
                message: "User with current email not found",
                field: "email"
            })
        }
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(user!._id!.toString())
        if (userConfirmationInfo !== null && userConfirmationInfo.isConfirmed) {
            errorsMessages.errorsMessages.push({
                message: "User with current email already confirmed",
                field: "email"
            })
        }

        const newUserConfirmationInfo = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
            isConfirmed: false
        }
        try {
            await emailManager.sendEmailConfirmationMessage(email, newUserConfirmationInfo.confirmationCode)
        } catch (error) {
            console.error(error)
            usersRepository.deleteUserById(user!._id!.toString())
            errorsMessages.errorsMessages.push({
                message: "Error sending confirmation email",
                field: "Email sender"
            })
            return {
                status: ResultStatus.BadRequest,
                data: errorsMessages
            }
        }
        await usersRepository.updateConfirmationInfo(user!._id!, newUserConfirmationInfo)
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
    async ckeckUserByRefreshToken(oldRefreshToken: string): Promise<UserDeviceInfoType | null> {
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(oldRefreshToken, SETTINGS.JWT.RT_SECRET)
        if (!oldRefreshToken || userVerifyInfo === null) {
            return null
        }
        const isUserExists = await usersQueryRepository.findUserById(userVerifyInfo!.userId)
        const deviceSeccion = await usersDevicesQueryRepository.getUserDeviceById(userVerifyInfo.deviceId)
        if (
            !isUserExists ||
            deviceSeccion === null ||
            new Date(userVerifyInfo!.iat! * 1000).toISOString() !== deviceSeccion?.lastActiveDate
        ) {
            return null
        }
        return { userId: userVerifyInfo.userId, deviceId: userVerifyInfo.deviceId, iat: userVerifyInfo.iat, exp: userVerifyInfo.exp }
    },

    async renewTokens(oldRefreshToken: string): Promise<Result<JWTTokensOutType | null>> {
        const userVerifyInfo = await this.ckeckUserByRefreshToken(oldRefreshToken)
        if (userVerifyInfo === null) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        const tokens = await jwtAdapter.createJWT(new ObjectId(userVerifyInfo.userId), userVerifyInfo.deviceId)
        return {
            status: ResultStatus.Success,
            data: tokens
        }
    },
    async logoutUser(oldRefreshToken: string): Promise<Result<null>> {
        const userVerifyInfo = await this.ckeckUserByRefreshToken(oldRefreshToken)
        if (userVerifyInfo === null) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }
        await usersDevicesRepository.deleteUserDevicebyId(userVerifyInfo.deviceId)
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
}
