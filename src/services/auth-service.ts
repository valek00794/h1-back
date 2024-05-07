import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'
import { ObjectId } from 'mongodb'

import { UserDeviceInfoType } from '../types/users-types'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus, SETTINGS } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { JWTTokensOutType } from '../adapters/jwt/jwt-types'
import { usersDevicesRepository } from '../repositories/usersDevices-repository'
import { usersService } from './users-service'

export const authService = {
    async checkCredential(userId: ObjectId, password: string, passwordHash: string): Promise<boolean> {
        const userConfirmationInfo = await usersRepository.findUserConfirmationInfo(userId!.toString())
        if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed) return false
        const isAuth = await bcryptArapter.checkPassword(password, passwordHash)
        return isAuth ? true : false
    },

    async confirmEmail(code: string): Promise<Result<APIErrorResult | null>> {
        const userConfirmationInfo = await usersRepository.findUserConfirmationInfo(code)
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
        const user = await usersRepository.findUserByLoginOrEmail(email)
        const errorsMessages: APIErrorResult = {
            errorsMessages: []
        }
        if (user === null) {
            errorsMessages.errorsMessages.push({
                message: "User with current email not found",
                field: "email"
            })
        }
        const userConfirmationInfo = await usersRepository.findUserConfirmationInfo(user!._id!.toString())
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
        const isUserExists = await usersRepository.findUserById(userVerifyInfo!.userId)
        const deviceSession = await usersDevicesRepository.getUserDeviceById(userVerifyInfo.deviceId)
        if (
            !isUserExists ||
            !deviceSession ||
            new Date(userVerifyInfo!.iat! * 1000).toISOString() !== deviceSession?.lastActiveDate
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

    async passwordRecovery(email: string): Promise<Result<APIErrorResult | null>> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (!user) {
            return {
                status: ResultStatus.NoContent,
                data: null
            }
        }

        const newUserRecoveryPasswordInfo = {
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
        }
        try {
            await emailManager.sendEmailPasswordRecoveryMessage(email, newUserRecoveryPasswordInfo.recoveryCode)
        } catch (error) {
            console.error(error)
            return {
                status: ResultStatus.BadRequest,
                data: {
                    errorsMessages: [{
                        message: "Error sending confirmation email",
                        field: "Email sender"
                    }]
                }
            }
        }
        await usersRepository.updatePasswordRecoveryInfo(user!._id!, newUserRecoveryPasswordInfo)
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
    async confirmPasswordRecovery(recoveryCode: string, newPassword: string): Promise<Result<APIErrorResult | null>> {
        const recoveryInfo = await usersRepository.findPasswordRecoveryInfo(recoveryCode)
        if (recoveryInfo === null) return {
            status: ResultStatus.BadRequest,
            data: {
                errorsMessages: [{
                    message: "User with current recovery code not found",
                    field: "recoveryCode"
                }]
            }
        }
        const errorsMessages: APIErrorResult = {
            errorsMessages: []
        }
        if (recoveryInfo !== null) {
            if (recoveryInfo.recoveryCode !== recoveryCode) {
                errorsMessages.errorsMessages.push({
                    message: "Recovery code does not match",
                    field: "recoveryCode"
                })
            }
            if (recoveryInfo.expirationDate < new Date()) {
                errorsMessages.errorsMessages.push({
                    message: "Recovery code has expired, needs to be requested again",
                    field: "recoveryCode"
                })
            }
            if (errorsMessages.errorsMessages.length !== 0) {
                return {
                    status: ResultStatus.BadRequest,
                    data: errorsMessages
                }
            }
        }
        await usersService.updateUserPassword(recoveryInfo!.userId!, newPassword)
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },
}
