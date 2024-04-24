import { ObjectId } from "mongodb";

import { PaginatorUsersViewType, UserDbType, UserInfoType, UserViewType } from "../types/users-types";
import { getSanitizationQuery } from "../utils";
import { SearchQueryParametersType } from "../types/query-types";
import { UsersModel } from "../db/mongo/users.model";
import { UsersEmailConfirmationsModel } from "../db/mongo/usersEmailConfirmation.model";
import { UsersRecoveryPassswordModel } from "../db/mongo/usersRecoveryPasssword.model";

export const usersQueryRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
        return await UsersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
    },

    async findUserConfirmationInfo(confirmationCodeOrUserId: string) {
        return await UsersEmailConfirmationsModel.findOne({ $or: [{ confirmationCode: confirmationCodeOrUserId }, { userId: confirmationCodeOrUserId }] })
    },

    async findPasswordRecoveryInfo(recoveryCodeOrUserId: string) {
        return await UsersRecoveryPassswordModel.findOne({ $or: [{ recoveryCode: recoveryCodeOrUserId }, { userId: recoveryCodeOrUserId }] })
    },

    async findUserById(id: string): Promise<UserInfoType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const user = await UsersModel.findById(id)
        return user ? {
            email: user.email,
            login: user.login,
            userId: id
        }
            : false
    },

    async getAllUsers(query?: SearchQueryParametersType): Promise<PaginatorUsersViewType> {
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

        return {
            pagesCount: Math.ceil(usersCount / sanitizationQuery.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: usersCount,
            items: users.map(user => this.mapToOutput(user))
        }
    },

    mapToOutput(user: UserDbType): UserViewType {
        return {
            id: user._id!,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
}