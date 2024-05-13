import { LikeStatusModel } from '../db/mongo/likeStatus-model'
import { ExtendedLikesInfo, LikeStatus, LikesInfo, LikesInfoView, NewestLike } from '../types/likes-types'

export class LikesQueryRepository {
    async getLikesInfo(parrentId: string): Promise<LikesInfo[]> {
        return await LikeStatusModel.find({ parrentId })
    }

    async getNewestLikes(parrentId: string): Promise<NewestLike[]> {
        const VIEW_LIKES_COUNT = 3
        const newestLike = await LikeStatusModel
            .find({ parrentId, status: LikeStatus.Like })
            .sort({ addedAt: -1 })
            .limit(VIEW_LIKES_COUNT)
        return this.mapNewestLikes(newestLike)
    }

    mapLikesInfo(likesInfo: LikesInfo[], userId?: string): LikesInfoView {
        const likesInfoView = new LikesInfoView(
            likesInfo.filter(like => like.status === LikeStatus.Like).length,
            likesInfo.filter(like => like.status === LikeStatus.Dislike).length,
            likesInfo.find(like => like.authorId.toHexString() === userId)?.status || LikeStatus.None
        )
        return likesInfoView
    }

    mapExtendedLikesInfo(likesInfo: LikesInfoView, newestLikes: NewestLike[]): ExtendedLikesInfo {
        return new ExtendedLikesInfo(
            likesInfo.likesCount,
            likesInfo.dislikesCount,
            likesInfo.myStatus, newestLikes
        )
    }

    mapNewestLikes(likesInfo: LikesInfo[]): NewestLike[] {
        return likesInfo.map(like =>
            new NewestLike(
                like.addedAt,
                like.authorId.toString(),
                like.authorLogin,
            )
        )
    }

}