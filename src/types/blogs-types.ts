import { ObjectId } from "mongodb"

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogDBType = BlogType & {
    _id?: ObjectId,
}

export type BlogViewType = BlogType & {
    id?: ObjectId,
}

export type PaginatorBlogViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewType[]
}
