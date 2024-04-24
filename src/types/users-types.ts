import { ObjectId } from "mongodb"

export type UserDbViewType = UserDBType & {
    _id?: ObjectId
}

export type UserViewType = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type UserDBType = {
    login: string,
    email: string,
    createdAt: string
    passwordHash: string,
}

export type PaginatorUsersViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewType[]
}

export type UserInfoType = {
    userId: string,
    login: string,
    email?: string
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string,
    email?: string
}

export type UserEmailConfirmationInfoType = {
    userId?: string,
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}

export type UserRecoveryPasswordInfoType = {
    userId?: string,
    recoveryCode: string,
    expirationDate: Date,
}

export type UserSignUpType = {
    user: UserDBType,
    emailConfirmation: UserEmailConfirmationInfoType | false
}

export type UsersDevicesType = {
    deviceId: string,
    title: string,
    userId?: string,
    ip: string,
    lastActiveDate?: string,
    expiryDate?: string
}

export type UserDeviceInfoType = {
    userId: string
    deviceId: string
    iat?: number
    exp?: number
}