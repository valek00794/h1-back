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

export class BlogView {
    constructor(public id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
    }
}
