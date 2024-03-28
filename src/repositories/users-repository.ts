import { ObjectId } from "mongodb";
import { usersCollection } from "../db/db";
import { UserDBType } from "../types/users-types";
import { usersQueryRepository } from "./users-query-repository";


export const usersRepository = {
    async createUser(user: UserDBType) {
        await usersCollection.insertOne(user)
        return usersQueryRepository.mapToOutput(user)
    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const user = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        if (user.deletedCount === 0) return false
        return true
    },

}