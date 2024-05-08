import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'
import { ObjectId } from 'mongodb'

import { UserDeviceInfoType } from '../types/users-types'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus, SETTINGS } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'
import { jwtAdapter } from '../adapters/jwt/jwt-adapter'
import { JWTTokensOutType } from '../adapters/jwt/jwt-types'
import { UsersRepository } from '../repositories/users-repository'
import { UsersDevicesRepository } from '../repositories/usersDevices-repository'
import { UsersService } from './users-service'

export class AuthService {
    constructor(protected usersRepository: UsersRepository, protected usersDevicesRepository: UsersDevicesRepository, protected usersService: UsersService) { }

    async checkCredential(userId: ObjectId, password: string, passwordHash: string): Promise<boolean> {
        const userConfirmationInfo = await this.usersRepository.findUserConfirmationInfo(userId!.toString())
        if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed) return false
        const isAuth = await bcryptArapter.checkPassword(password, passwordHash)
        return isAuth ? true : false
    }

    async confirmEmail(code: string): Promise<Result<APIErrorResult | null>> {
        const userConfirmationInfo = await this.usersRepository.findUserConfirmationInfo(code)
        const errors: APIErrorResult = {
            errorsMessages: []
        }
        if (userConfirmationInfo === null) {
            errors.errorsMessages.push({
                message: "User with current confirmation code not found",
                field: "code"
            })
            return new Result<null>(
                ResultStatus.BadRequest,
                null,
                errors
            )
        }


        if (userConfirmationInfo !== null) {
            if (userConfirmationInfo.isConfirmed) {
                errors.errorsMessages.push({
                    message: "User with current confirmation code already confirmed",
                    field: "code"
                })
            }
            if (userConfirmationInfo.confirmationCode !== code) {
                errors.errorsMessages.push({
                    message: "Verification code does not match",
                    field: "code"
                })
            }
            if (userConfirmationInfo.expirationDate < new Date()) {
                errors.errorsMessages.push({
                    message: "Verification code has expired, needs to be requested again",
                    field: "code"
                })
            }
            if (errors.errorsMessages.length !== 0) {
                return new Result<null>(
                    ResultStatus.BadRequest,
                    null,
                    errors
                )
            }
        }

        await this.usersRepository.updateConfirmation(userConfirmationInfo!._id)
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async resentConfirmEmail(email: string): Promise<Result<APIErrorResult | null>> {
        const user = await this.usersRepository.findUserByLoginOrEmail(email)
        const errors: APIErrorResult = {
            errorsMessages: []
        }
        if (user === null) {
            errors.errorsMessages.push({
                message: "User with current email not found",
                field: "email"
            })
        }
        const userConfirmationInfo = await this.usersRepository.findUserConfirmationInfo(user!._id!.toString())
        if (userConfirmationInfo !== null && userConfirmationInfo.isConfirmed) {
            errors.errorsMessages.push({
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
            this.usersRepository.deleteUserById(user!._id!.toString())
            errors.errorsMessages.push({
                message: "Error sending confirmation email",
                field: "Email sender"
            })
            return new Result<null>(
                ResultStatus.BadRequest,
                null,
                errors
            )
        }

        await this.usersRepository.updateConfirmationInfo(user!._id!, newUserConfirmationInfo)
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async checkUserByRefreshToken(oldRefreshToken: string): Promise<Result<UserDeviceInfoType | null>> {
        const userVerifyInfo = await jwtAdapter.getUserInfoByToken(oldRefreshToken, SETTINGS.JWT.RT_SECRET)
        if (!oldRefreshToken || userVerifyInfo === null) {
            return new Result<null>(ResultStatus.NotFound, null, null)
        }

        const isUserExists = await this.usersRepository.findUserById(userVerifyInfo!.userId)
        const deviceSession = await this.usersDevicesRepository.getUserDeviceById(userVerifyInfo.deviceId)
        if (!isUserExists || !deviceSession || new Date(userVerifyInfo!.iat! * 1000).toISOString() !== deviceSession?.lastActiveDate) {
            return new Result<null>(ResultStatus.NotFound, null, null)
        }

        const userDeviceInfo: UserDeviceInfoType = {
            userId: userVerifyInfo.userId,
            deviceId: userVerifyInfo.deviceId,
            iat: userVerifyInfo.iat,
            exp: userVerifyInfo.exp
        }

        return new Result<UserDeviceInfoType>(ResultStatus.Success, userDeviceInfo, null)
    }

    async renewTokens(oldRefreshToken: string): Promise<Result<JWTTokensOutType | null>> {
        const userVerifyInfo = await this.checkUserByRefreshToken(oldRefreshToken)
        if (userVerifyInfo.data === null) {
            return new Result<null>(
                ResultStatus.Unauthorized,
                null,
                null
            )
        }
        const tokens = await jwtAdapter.createJWT(new ObjectId(userVerifyInfo.data.userId), userVerifyInfo.data.deviceId)
        return new Result<JWTTokensOutType>(
            ResultStatus.Success,
            tokens,
            null
        )
    }

    async logoutUser(oldRefreshToken: string): Promise<Result<null>> {
        const userVerifyInfo = await this.checkUserByRefreshToken(oldRefreshToken)
        if (userVerifyInfo.data === null) {
            return new Result<null>(
                ResultStatus.Unauthorized,
                null,
                null
            )
        }
        await this.usersDevicesRepository.deleteUserDevicebyId(userVerifyInfo.data.deviceId)
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async passwordRecovery(email: string): Promise<Result<null>> {
        const user = await this.usersRepository.findUserByLoginOrEmail(email)
        if (user === null) {
            return new Result<null>(
                ResultStatus.NoContent,
                null,
                null
            )
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
            const errors: APIErrorResult = {
                errorsMessages: []
            }
            errors.errorsMessages.push({
                message: "Error sending confirmation email",
                field: "Email sender"
            })
            return new Result<null>(
                ResultStatus.BadRequest,
                null,
                errors
            )
        }
        await this.usersRepository.updatePasswordRecoveryInfo(user!._id!, newUserRecoveryPasswordInfo)
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async confirmPasswordRecovery(recoveryCode: string, newPassword: string): Promise<Result<null>> {
        const recoveryInfo = await this.usersRepository.findPasswordRecoveryInfo(recoveryCode)
        const errors: APIErrorResult = {
            errorsMessages: []
        }
        if (recoveryInfo === null) {
            errors.errorsMessages.push({
                message: "User with current recovery code not found",
                field: "recoveryCode"
            })
            return new Result<null>(
                ResultStatus.BadRequest,
                null,
                errors

            )
        }

        if (recoveryInfo !== null) {
            if (recoveryInfo.recoveryCode !== recoveryCode) {
                errors.errorsMessages.push({
                    message: "Recovery code does not match",
                    field: "recoveryCode"
                })
            }
            if (recoveryInfo.expirationDate < new Date()) {
                errors.errorsMessages.push({
                    message: "Recovery code has expired, needs to be requested again",
                    field: "recoveryCode"
                })
            }

            if (errors.errorsMessages.length !== 0) {
                return new Result<null>(
                    ResultStatus.BadRequest,
                    null,
                    errors
                )
            }
        }

        await this.usersService.updateUserPassword(recoveryInfo!.userId!, newPassword)

        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}