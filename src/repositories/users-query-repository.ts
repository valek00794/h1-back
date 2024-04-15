import { ObjectId } from "mongodb";

import { usersCollection, usersEmailConfirmationCollection } from "../db/db";
import { PaginatorUsersViewType, UserDbViewType, UserInfo, UserViewType } from "../types/users-types";
import { getSanitizationQuery } from "../utils";
import { SearchQueryParametersType } from "../types/query-types";

export const usersQueryRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbViewType | null> {
        return await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
    },

    async findUserConfirmationInfo(confirmationCodeOrUserId: string) {
        return await usersEmailConfirmationCollection.findOne({ $or: [{ confirmationCode: confirmationCodeOrUserId }, { userId: confirmationCodeOrUserId }] })
    },

    async findUserById(id: string): Promise<UserInfo | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const user = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (user === null) return false
        return {
            email: user.email,
            login: user.login,
            userId: id
        }
    },

    async getAllUsers(query?: SearchQueryParametersType): Promise<PaginatorUsersViewType> {
        const sanitizationQuery = getSanitizationQuery(query)
        let findOptions = {
            $or: [
                sanitizationQuery.searchLoginTerm !== null ? { login: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } : {},
                sanitizationQuery.searchEmailTerm !== null ? { email: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}
            ]
        }
        const users = await usersCollection
            .find(findOptions)
            .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)
            .toArray()

        const usersCount = await usersCollection.countDocuments(findOptions)

        return {
            pagesCount: Math.ceil(usersCount / sanitizationQuery.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: usersCount,
            items: users.map(user => this.mapToOutput(user))
        }
    },

    mapToOutput(user: UserDbViewType): UserViewType {
        return {
            id: user._id!,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

}