import { LikesStatusModel } from '../db/mongo/commentLikesStatus-model'
import { LikeStatus, LikeStatusParrent, LikesInfo, LikesInfoView } from '../types/likes-types'

export class LikesQueryRepository {
    async getLikesInfo(parrentId: string, parrentName: LikeStatusParrent) {
        return await LikesStatusModel.findOne({ parrentId, parrentName })
    }

    mapLikesInfo(userId: string, likesInfo?: LikesInfo): LikesInfoView {
        let myLikeStatus = LikeStatus.None
        if (userId && likesInfo?.likesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Like
        }
        if (userId && likesInfo?.dislikesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Dislike
        }
        const likesCount = likesInfo?.likesUsersIds.length || 0
        const dislikesCount = likesInfo?.dislikesUsersIds.length || 0
        return new LikesInfoView(likesCount, dislikesCount, myLikeStatus)
    }

    mapExtendedLikesInfo(userId: string, likesInfo?: LikesInfo) {
        let myLikeStatus = LikeStatus.None
        if (userId && likesInfo?.likesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Like
        }
        if (userId && likesInfo?.dislikesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Dislike
        }
        const likesCount = likesInfo?.likesUsersIds.length || 0
        const dislikesCount = likesInfo?.dislikesUsersIds.length || 0

        return new LikesInfoView(likesCount, dislikesCount, myLikeStatus)
    }

}