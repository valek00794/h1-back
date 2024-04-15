import { usersRevokedTokensCollection } from "../db/db"
import { UsersRevokedTokens } from "../types/users-types"

export const revokedTokensRepository = {
    async addRevokedToken(revokedToken: UsersRevokedTokens ) {
        return await usersRevokedTokensCollection.insertOne(revokedToken)  
    },
}