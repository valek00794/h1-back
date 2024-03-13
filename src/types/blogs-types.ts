import { ObjectId } from "mongodb"

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogDBType = Pick<BlogType, keyof BlogType> & {
    _id: ObjectId,
}

export type BlogViewType = Pick<BlogType, keyof BlogType> & {
    id: ObjectId,
}
