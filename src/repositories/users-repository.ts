import { ObjectId } from "mongodb"

import { UserEmailConfirmationInfoType, UserRecoveryPasswordInfoType, UserSignUpType, UserDbType, UserInfoType } from "../types/users-types"
import { UsersModel } from "../db/mongo/users.model"
import { UsersEmailConfirmationsModel } from "../db/mongo/usersEmailConfirmation.model"
import { UsersRecoveryPassswordModel } from "../db/mongo/usersRecoveryPasssword.model"

class UsersRepository {
    async createUser(signUpData: UserSignUpType): Promise<UserDbType> {
        const user = new UsersModel(signUpData.user)
        await user.save()
        if (signUpData.emailConfirmation) {
            const emailConfirmation = new UsersEmailConfirmationsModel({ userId: user._id.toString(), ...signUpData.emailConfirmation })
            await emailConfirmation.save()
        }
        return user
    }
    
    async deleteUserById(id: string): Promise<boolean> {
        await UsersEmailConfirmationsModel.deleteOne({ userId: id })
        const deleteResult = await UsersModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    }

    async updateUserPassword(userId: string, passwordHash: string): Promise<boolean> {
        await UsersRecoveryPassswordModel.deleteOne({ userId })
        const updatedResult = await UsersModel.findByIdAndUpdate(userId, { passwordHash }, { new: true })
        return updatedResult ? true : false
    }

    async updateConfirmationInfo(userId: ObjectId, emailConfirmationInfo: UserEmailConfirmationInfoType) {
        return await UsersEmailConfirmationsModel.updateOne({ userId: userId.toString() }, { $set: { ...emailConfirmationInfo } })
    }

    async updateConfirmation(id: ObjectId) {
        return await UsersEmailConfirmationsModel.findByIdAndUpdate(id, { isConfirmed: true }, { new: true })
    }

    async updatePasswordRecoveryInfo(userId: ObjectId, updatedRecoveryInfo: UserRecoveryPasswordInfoType) {
        const recoveryInfo = new UsersRecoveryPassswordModel({ userId: userId.toString(), ...updatedRecoveryInfo })
        await recoveryInfo.save()
        return recoveryInfo
    }

    async findUserConfirmationInfo(confirmationCodeOrUserId: string) {
        return await UsersEmailConfirmationsModel.findOne({ $or: [{ confirmationCode: confirmationCodeOrUserId }, { userId: confirmationCodeOrUserId }] })
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
        return await UsersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
    }

    async findPasswordRecoveryInfo(recoveryCodeOrUserId: string) {
        return await UsersRecoveryPassswordModel.findOne({ $or: [{ recoveryCode: recoveryCodeOrUserId }, { userId: recoveryCodeOrUserId }] })
    }

    async findUserById(id: string): Promise<false | UserInfoType | null> {
        return await UsersModel.findById(id)
    }
}

export const usersRepository = new UsersRepository()