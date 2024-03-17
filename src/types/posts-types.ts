import { ObjectId } from "mongodb"

export type CreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostType = {
    blogName: string,
    createdAt: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId
}

export type PostDbType = PostType & {
    _id: ObjectId,
}

export type PostViewType =  PostType & {
    id: ObjectId,
}

export type PaginatorPostViewType = {
    pagesCount:	number,
    page:	number,
    pageSize:	number,
    totalCount:	number,
    items: PostViewType[]
}
