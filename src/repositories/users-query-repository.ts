import { ObjectId } from "mongodb"

import { UserDbType, UserInfo, UserView } from "../types/users-types"
import { getSanitizationQuery } from "../utils"
import { SearchQueryParametersType } from "../types/query-types"
import { UsersModel } from "../db/mongo/users.model"
import { Paginator } from "../types/result-types"

export class UsersQueryRepository {
    async findUserById(id: string): Promise<UserInfo | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const user = await UsersModel.findById(id)
        return user ? new UserInfo(
            user.email,
            user.login,
            id
        )
            : false
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
        return await UsersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
    }

    async getAllUsers(query?: SearchQueryParametersType): Promise<Paginator<UserView[]>> {
        const sanitizationQuery = getSanitizationQuery(query)
        let findOptions = {
            $or: [
                sanitizationQuery.searchLoginTerm !== null ? { login: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } : {},
                sanitizationQuery.searchEmailTerm !== null ? { email: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}
            ]
        }
        const users = await UsersModel
            .find(findOptions)
            .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)

        const usersCount = await UsersModel.countDocuments(findOptions)

        return new Paginator<UserView[]>(
            sanitizationQuery.pageNumber,
            sanitizationQuery.pageSize,
            usersCount,
            users.map(user => this.mapToOutput(user))
        )
    }

    mapToOutput(user: UserDbType): UserView {
        return new UserView(
            user._id!,
            user.login,
            user.email,
            user.createdAt
        )
    }
}
