import { ObjectId, SortDirection } from "mongodb";
import { usersCollection } from "../db/db";
import { PaginatorUsersViewType, UserDBType, UserDbViewType, UserViewType } from "../types/users-types";
import { SearchQueryParametersType } from "../types/query-types";

const defaultSearchQueryParameters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc' as SortDirection,
    searchLoginTerm: null,
    searchEmailTerm: null
}

export const usersRepository = {
    async createUser(user: UserDBType): Promise<UserDBType> {
        await usersCollection.insertOne(user)
        return user
    },
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { userName: loginOrEmail }] })
    },
    async deleteUserById(id: string): Promise<boolean> {
        if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
            return false
        }
        const user = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        if (user.deletedCount === 0) return false
        return true
    },
    async getAllUsers(query?: any): Promise<PaginatorUsersViewType> {
        const sanitizationQuery = this.getSanitizationQuery(query)
        let findOptions = sanitizationQuery.searchLoginTerm !== null ? { name: { $regex: sanitizationQuery.searchLoginTerm, $options: 'i' } } :
            sanitizationQuery.searchEmailTerm !== null ? { name: { $regex: sanitizationQuery.searchEmailTerm, $options: 'i' } } : {}

        const users = await usersCollection
            .find(findOptions)
            .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)
            .toArray()

        const usersCount = await usersCollection.countDocuments()

        return {
            pagesCount: Math.ceil(usersCount / defaultSearchQueryParameters.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: usersCount,
            items: users.map(user => this.mapToOutput(user))
        }
    },
    mapToOutput(user: UserDbViewType): UserViewType {
        return {
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    getSanitizationQuery(query: SearchQueryParametersType) {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : defaultSearchQueryParameters.pageNumber,
            pageSize: query.pageSize ? +query.pageSize : defaultSearchQueryParameters.pageSize,
            sortBy: query.sortBy ? query.sortBy : defaultSearchQueryParameters.sortBy,
            sortDirection: query.sortDirection ? query.sortDirection : defaultSearchQueryParameters.sortDirection,
            searchLoginTerm: query?.searchNameTerm ? query.searchNameTerm : defaultSearchQueryParameters.searchLoginTerm,
            searchEmailTerm: query?.searchNameTerm ? query.searchNameTerm : defaultSearchQueryParameters.searchEmailTerm,
        }
    }
}