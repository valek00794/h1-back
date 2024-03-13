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

export type PostDbType = Pick<PostType, keyof PostType> & {
    _id: ObjectId,
}

export type PostViewType =  Pick<PostType, keyof PostType> & {
    id: ObjectId,
}

