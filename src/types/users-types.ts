import { ObjectId, WithId } from "mongodb"

export type UserDbType = WithId<UserType>

export class UserView {
    constructor(
        public id: ObjectId,
        public login: string,
        public email: string,
        public createdAt: string,
    ) { }
}

export type UserType = {
    login: string,
    email: string,
    createdAt: string
    passwordHash: string,
}

export class UserInfo {
    constructor(
        public userId: string,
        public login: string,
        public email?: string,
    ) { }
}

export class CommentatorInfo {
    constructor(
        public userId: string,
        public userLogin: string,
        public email?: string,
    ) { }
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
    user: UserType,
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

export class UsersDevicesOutput {
    constructor(
        public ip: string,
        public title: string,
        public deviceId: string,
        public lastActiveDate?: string,
    ) { }
}

export type UserDeviceInfoType = {
    userId: string
    deviceId: string
    iat?: number
    exp?: number
}