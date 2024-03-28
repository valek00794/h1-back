import bcrypt from 'bcrypt'

import { UserDBType, UserViewType } from '../types/users-types'
import { usersQueryRepository } from '../repositories/users-query-repository'
import { usersRepository } from '../repositories/users-repository'

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
        return usersRepository.createUser(newUser)
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async checkCredential(loginOrEmail: string, password: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (user === null) return false
        return bcrypt.compare(password, user.passwordHash)
    },
}
