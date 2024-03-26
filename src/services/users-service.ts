import bcrypt from 'bcrypt'

import { UserDBType } from '../types/users-types'
import { usersRepository } from '../repositories/users-repository'

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UserDBType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UserDBType = {
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async checkCredential(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (user === null) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) return false
        return true
    },
}
