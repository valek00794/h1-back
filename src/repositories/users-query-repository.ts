import { ObjectId } from "mongodb";
import { usersCollection } from "../db/db";
import { PaginatorUsersViewType, UserDbViewType, UserViewType } from "../types/users-types";
import { getSanitizationQuery } from "../utils";

export const usersQueryRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { userName: loginOrEmail }] })
    },

    async findUserById(id: string): Promise<UserDbViewType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const user = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (user === null) return false
        return user
    },

    async getAllUsers(query?: any): Promise<PaginatorUsersViewType> {
        const sanitizationQuery = getSanitizationQuery(query)
        let findOptions = sanitizationQuery.searchLoginTerm !== null ? { name: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } :
            sanitizationQuery.searchEmailTerm !== null ? { name: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}

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