import { ObjectId, WithId } from "mongodb"

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type LikesInfoType = {
    commentId?: ObjectId
    likesUsersIds: String[],
    dislikesUsersIds: String[],
}

export type LikesInfoDBType = WithId<LikesInfoType>

export type LikesInfoViewType = {
    likesCount: Number,
    dislikesCount: Number,
    myStatus: LikeStatus
}