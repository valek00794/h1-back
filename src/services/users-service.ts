import bcrypt from 'bcrypt'
import { ObjectId, UpdateResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns/add'

import { UserDBType, UserDbViewType, UserEmailConfirmationInfo, UserSignUpType, UserViewType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'
import { emailManager } from '../managers/email-manager'

export const usersService = {
    async createUser(login: string, email: string, password: string, requireConfirmation?: boolean): Promise<UserViewType | null> {
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
                return null
            }
        }
        return usersQueryRepository.mapToOutput(createdUser)
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
    async confirmEmail(code: string): Promise<false | UpdateResult<UserEmailConfirmationInfo>> {
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(code)
        if (userConfirmationInfo === null) return false
        if (userConfirmationInfo.isConfirmed) return false
        if (userConfirmationInfo.confirmationCode !== code) return false
        if (userConfirmationInfo.expirationDate < new Date()) return false
        return await usersRepository.updateConfirmation(userConfirmationInfo._id)
    },
    async resentConfirmEmail(email: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(email)
        if (user === null) return false
        const userConfirmationInfo = await usersQueryRepository.findUserConfirmationInfo(user._id!.toString())
        if (userConfirmationInfo !== null && userConfirmationInfo.isConfirmed) return false

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
            usersRepository.deleteUserById(user._id!.toString())
            return false
        }
        return await usersRepository.updateConfirmationInfo(user._id!, newUserConfirmationInfo)
    },
}
