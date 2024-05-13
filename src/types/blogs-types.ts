import { ObjectId, WithId } from "mongodb"

export class Blog {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) { }
}

export type BlogDbType = WithId<Blog>

export class BlogView extends Blog {
    constructor(blog: Blog, public id: ObjectId) {
        super(blog.name,
            blog.description,
            blog.websiteUrl,
            blog.createdAt,
            blog.isMembership
        )
    }
}
