import { ObjectId, WithId } from "mongodb"

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export class LikesInfo {
    constructor(
        public likesUsersIds: string[],
        public dislikesUsersIds: string[],
        public commentId?: ObjectId,
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