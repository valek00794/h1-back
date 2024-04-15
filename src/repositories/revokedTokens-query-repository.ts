import { usersRevokedTokensCollection } from "../db/db"
import { UsersRevokedTokens } from "../types/users-types"

export const revokedTokensQueryRepository = {
    async findRevokedToken(token: string ): Promise<UsersRevokedTokens | null> {
        return await usersRevokedTokensCollection.findOne({token})  
    },
}