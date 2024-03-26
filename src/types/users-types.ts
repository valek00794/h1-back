import { ObjectId } from "mongodb"

export type UserDbViewType = UserType & {
    _id: ObjectId
}

export type UserViewType = UserType & {
    id: ObjectId
}

export type UserDBType = {
    login: string,
    email: string,
    createdAt: string
    passwordHash: string,
    passwordSalt: string,
}

export type PaginatorUsersViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewType[]
}

type UserInputType = {
    login: string,
    password: string,
    email: string,
}

type LoginType = {
    loginOrEmail: ObjectId
    password: string,
}

type UserType = {
    login: string,
    email: string,
    createdAt: string
}

