import { ObjectId, WithId } from "mongodb"

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogDbType = WithId<BlogType>

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
