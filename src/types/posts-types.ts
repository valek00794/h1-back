import { ObjectId } from "mongodb"
export type CreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type OutputPostType = {
    id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string
}
