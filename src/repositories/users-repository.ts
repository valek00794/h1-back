import { DeleteResult, ObjectId } from "mongodb";

import { usersCollection } from "../db/db";
import { UserDBType } from "../types/users-types";

export const usersRepository = {
    async createUser(user: UserDBType): Promise<UserDBType> {
        await usersCollection.insertOne(user)
        return user
    },
    async deleteUserById(id: string): Promise<DeleteResult> {
        return await usersCollection.deleteOne({ _id: new ObjectId(id) })
    },
}