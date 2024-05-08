import { ObjectId, WithId } from "mongodb"

export type CreatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export class Post {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: string,
    ) { }
}

export type PostDbType = WithId<Post>

export type PostViewType = Post & {
    id: ObjectId,
}
