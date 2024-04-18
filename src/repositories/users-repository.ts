import { DeleteResult, ObjectId, UpdateResult } from "mongodb";

import { usersCollection, usersEmailConfirmationCollection } from "../db/db";
import { UserDBType, UserEmailConfirmationInfoType, UserSignUpType } from "../types/users-types";

export const usersRepository = {
    async createUser(signUpData: UserSignUpType): Promise<UserDBType> {
        const newUser = await usersCollection.insertOne(signUpData.user)
        if (signUpData.emailConfirmation) {
            await usersEmailConfirmationCollection.insertOne({ userId: newUser.insertedId.toString(), ...signUpData.emailConfirmation })
        }
        return signUpData.user
    },
    async deleteUserById(id: string): Promise<DeleteResult> {
        await usersEmailConfirmationCollection.deleteOne({ userId: id })
        return await usersCollection.deleteOne({ _id: new ObjectId(id) })
    },
    async updateConfirmationInfo(userId: ObjectId, emailConfirmationInfo: UserEmailConfirmationInfoType) {
        return await usersEmailConfirmationCollection.updateOne({ userId: userId.toString() }, { $set: { ...emailConfirmationInfo } })
    },
    async updateConfirmation(_id: ObjectId): Promise<UpdateResult<UserEmailConfirmationInfoType>> {
        return await usersEmailConfirmationCollection.updateOne({ _id }, { $set: { isConfirmed: true } })
    },
}