import { ObjectId, WithId } from "mongodb"
import { ExtendedLikesInfo } from "./likes-types"

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

export class PostView extends Post {
    constructor(post: Post, public id: ObjectId) {
        super(post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt)
    }
}

export type PostDbType = WithId<Post>


