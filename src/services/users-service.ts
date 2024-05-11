
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDbType, UserSignUpType } from '../types/users-types'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'
import { UsersRepository } from '../repositories/users-repository'

export class UsersService {
    constructor(protected usersRepository: UsersRepository) { }

    async signUpUser(login: string, email: string, password: string): Promise<Result<null>> {
        const passwordHash = await bcryptArapter.generateHash(password)
        const signUpData: UserSignUpType = {
            user: {
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        const createdUser = await this.usersRepository.createUser(signUpData)

        if (signUpData.emailConfirmation) {
            try {
                await emailManager.sendEmailConfirmationMessage(signUpData.user.email, signUpData.emailConfirmation.confirmationCode)
            } catch (error) {
                console.error(error)
                this.usersRepository.deleteUserById(createdUser._id!.toString())
                const errors: APIErrorResult = {
                    errorsMessages: [{
                        message: "Error sending confirmation email",
                        field: "Email sender"
                    }]
                }
                return new Result<null>(
                    ResultStatus.BadRequest,
                    null,
                    errors
                )
            }
        }
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

    async createUser(login: string, email: string, password: string): Promise<UserDbType> {
        const passwordHash = await bcryptArapter.generateHash(password)
        const signUpData: UserSignUpType = {
            user: {
                login,
                email,
                passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: false
        }
        return await this.usersRepository.createUser(signUpData)
    }

    async updateUserPassword(userId: string, password: string): Promise<boolean> {
        if (!ObjectId.isValid(userId)) {
            return false
        }
        const passwordHash = await bcryptArapter.generateHash(password)
        return await this.usersRepository.updateUserPassword(userId, passwordHash)
    }

    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await this.usersRepository.deleteUserById(id)
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
                message: "Error sending recovery email",
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

        await this.updateUserPassword(recoveryInfo!.userId!, newPassword)

        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }

}