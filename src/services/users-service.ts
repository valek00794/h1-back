import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDBType, UserDbViewType, UserSignUpType, UserViewType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result, ResultStatus } from '../types/result-types'

export const usersService = {
    async createUser(login: string, email: string, password: string, requireConfirmation?: boolean): Promise<Result<UserViewType | APIErrorResult | null>> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const signUpData: UserSignUpType = {
            user: {
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: false
        }
        if (requireConfirmation) {
            signUpData.emailConfirmation = {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        const createdUser: UserDbViewType = await usersRepository.createUser(signUpData)

        if (signUpData.emailConfirmation) {
            try {
                await emailManager.sendEmailConfirmationMessage(signUpData.user.email, signUpData.emailConfirmation.confirmationCode)
            } catch (error) {
                console.error(error)
                usersRepository.deleteUserById(createdUser._id!.toString())
                return {
                    status: ResultStatus.BAD_REQUEST_400,
                    data: {
                        errorsMessages: [{
                            message: "Error sending confirmation email",
                            field: "Email sender"
                        }]
                    }
                }
            }
        }
        if (requireConfirmation) {
            return {
                status: ResultStatus.NO_CONTENT_204,
                data: null
            }
        }

        return {
            status: ResultStatus.CREATED_201,
            data: usersQueryRepository.mapToOutput(createdUser),
        }

    },

    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    },

    async checkCredential(loginOrEmail: string, password: string): Promise<false | UserDBType> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (user === null) return false
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(user._id!.toString())
        if (userConfirmationInfo !== null && !userConfirmationInfo.isConfirmed) return false
        const isAuth = await bcrypt.compare(password, user.passwordHash)
        return isAuth ? user : false
    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const res = await usersRepository.deleteUserById(id)
        if (res.deletedCount === 0) return false
        return true
    },
    async confirmEmail(code: string): Promise<Result<APIErrorResult | null>> {
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(code)
        const errorsMessages: APIErrorResult = {
            errorsMessages: []
        }
        if (userConfirmationInfo === null) {
            errorsMessages.errorsMessages.push({
                message: "User with current confirmation code not found",
                field: "code"
            })
            return {
                status: ResultStatus.BAD_REQUEST_400,
                data: errorsMessages
            }
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
                    status: ResultStatus.BAD_REQUEST_400,
                    data: errorsMessages
                }
            }
        }
        await usersRepository.updateConfirmation(userConfirmationInfo!._id)
        return {
            status: ResultStatus.NO_CONTENT_204,
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
            return {
                status: ResultStatus.BAD_REQUEST_400,
                data: errorsMessages
            }
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
        }
        if (errorsMessages.errorsMessages.length !== 0) {
            return {
                status: ResultStatus.BAD_REQUEST_400,
                data: errorsMessages
            }
        }
        await usersRepository.updateConfirmationInfo(user!._id!, newUserConfirmationInfo)
        return {
            status: ResultStatus.NO_CONTENT_204,
            data: null
        }
    },
}
