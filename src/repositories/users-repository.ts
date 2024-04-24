import { ObjectId } from "mongodb";

import { UserEmailConfirmationInfoType, UserRecoveryPasswordInfoType, UserSignUpType, UserDbType } from "../types/users-types";
import { UsersModel } from "../db/mongo/users.model";
import { UsersEmailConfirmationsModel } from "../db/mongo/usersEmailConfirmation.model";
import { UsersRecoveryPassswordModel } from "../db/mongo/usersRecoveryPasssword.model";

export const usersRepository = {
    async createUser(signUpData: UserSignUpType): Promise<UserDbType> {
        const user = new UsersModel(signUpData.user)
        await user.save()
        if (signUpData.emailConfirmation) {
            const emailConfirmation = new UsersEmailConfirmationsModel({ userId: user._id.toString(), ...signUpData.emailConfirmation })
            await emailConfirmation.save()
        }
        return user
    },
    async deleteUserById(id: string): Promise<boolean> {
        await UsersEmailConfirmationsModel.deleteOne({ userId: id })
        const deleteResult = await UsersModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
    async updateUserPassword(userId: string, passwordHash: string): Promise<boolean> {
        await UsersRecoveryPassswordModel.deleteOne({ userId })
        const updatedResult = await UsersModel.findByIdAndUpdate(userId, { passwordHash }, { new: true });
        return updatedResult ? true : false
    },
    async updateConfirmationInfo(userId: ObjectId, emailConfirmationInfo: UserEmailConfirmationInfoType) {
        return await UsersEmailConfirmationsModel.updateOne({ userId: userId.toString() }, { $set: { ...emailConfirmationInfo } })
    },
    async updateConfirmation(id: ObjectId) {
        return await UsersEmailConfirmationsModel.findByIdAndUpdate(id, { isConfirmed: true }, { new: true })
    },
    async updatePasswordRecoveryInfo(userId: ObjectId, updatedRecoveryInfo: UserRecoveryPasswordInfoType) {
        const recoveryInfo = new UsersRecoveryPassswordModel({ userId: userId.toString(), ...updatedRecoveryInfo })
        await recoveryInfo.save()
        return recoveryInfo
    },
}