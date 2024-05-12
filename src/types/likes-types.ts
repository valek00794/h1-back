import { ObjectId, WithId } from "mongodb"

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export enum LikeStatusParrent {
    Post = 'Post',
    Comment = 'Comment',
}

export class LikesInfo {
    constructor(
        public parrentId: ObjectId,
        public parrentName: LikeStatusParrent,
        public likesUsersIds: string[],
        public dislikesUsersIds: string[],

    ) { }
}

export type LikesInfoDBType = WithId<LikesInfo>

export class LikesInfoView {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: LikeStatus
    ) { }
}

export class NewestLike {
    constructor(
        public addedAt: Date,
        public userId: string,
        public login: string
    ) { }
}

export class ExtendedLikesInfo extends LikesInfoView {
    constructor(likesInfoView: LikesInfoView,
        public newestLikes: [NewestLike]) {
        super(
            likesInfoView.likesCount,
            likesInfoView.dislikesCount,
            likesInfoView.myStatus,)
    }
}