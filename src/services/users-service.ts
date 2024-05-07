
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDbType, UserSignUpType } from '../types/users-types'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'
import { APIErrorResult, Result } from '../types/result-types'
import { ResultStatus } from '../settings'
import { bcryptArapter } from '../adapters/bcypt-adapter'

export const usersService = {
    async signUpUser(login: string, email: string, password: string): Promise<Result<APIErrorResult | null>> {
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
        const createdUser = await usersRepository.createUser(signUpData)

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
        return {
            status: ResultStatus.NoContent,
            data: null
        }
    },

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
        return await usersRepository.createUser(signUpData)
    },

    async updateUserPassword(userId: string, password: string): Promise<boolean> {
        if (!ObjectId.isValid(userId)) {
            return false
        }
        const passwordHash = await bcryptArapter.generateHash(password)
        return await usersRepository.updateUserPassword(userId, passwordHash)
    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await usersRepository.deleteUserById(id)
    }
}
