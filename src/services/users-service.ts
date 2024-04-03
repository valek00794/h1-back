import bcrypt from 'bcrypt'

import { UserDBType, UserViewType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'
import { ObjectId } from 'mongodb'

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UserViewType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UserDBType = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        }

        const createdUser = await usersRepository.createUser(newUser)
        return usersQueryRepository.mapToOutput(createdUser)
    },

    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    },

    async checkCredential(loginOrEmail: string, password: string): Promise<false | UserDBType> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (user === null) return false
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
}
