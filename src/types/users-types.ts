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
