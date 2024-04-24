
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDbViewType, UserSignUpType, UserViewType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'

export const usersService = {
    async createUser(login: string, email: string, password: string, requireConfirmation?: boolean): Promise<Result<UserViewType | APIErrorResult | null>> {
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
                    status: ResultStatus.BadRequest,
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
                status: ResultStatus.NoContent,
                data: null
            }
        }

        return {
            status: ResultStatus.Created,
            data: usersQueryRepository.mapToOutput(createdUser),
        }
    },

    async updateUserPassword(userId: string, password: string): Promise<boolean> {
        const passwordHash = await bcryptArapter.generateHash(password)
        await usersRepository.updateUserPassword(userId, passwordHash)
        return true
    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const res = await usersRepository.deleteUserById(id)
        if (res.deletedCount === 0) return false
        return true
    }
}
