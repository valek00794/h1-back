import { injectable } from 'inversify';

import { LikeStatusModel } from '../db/mongo/likeStatus-model'
import { ExtendedLikesInfo, LikeStatus, LikesInfo, LikesInfoView, NewestLike } from '../types/likes-types'

@injectable()
export class LikesQueryRepository {
    async getLikesInfo(parrentId: string): Promise<LikesInfo[]> {
        return await LikeStatusModel.find({ parrentId })
    }
    mapLikesInfo(likesInfo: LikesInfo[], userId?: string): LikesInfoView {
        const likesInfoView = new LikesInfoView(
            likesInfo.filter(like => like.status === LikeStatus.Like).length,
            likesInfo.filter(like => like.status === LikeStatus.Dislike).length,
            likesInfo.find(like => like.authorId.toHexString() === userId)?.status || LikeStatus.None
        )
        return likesInfoView
    }

    mapExtendedLikesInfo(likesInfo: LikesInfo[], userId?: string): ExtendedLikesInfo {
        const newestLikes = likesInfo.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()).slice(0, 3)
        const mappedLikesInfo = this.mapLikesInfo(likesInfo!, userId)
        const newestLikesView = newestLikes.map(like =>
            new NewestLike(
                like.addedAt,
                like.authorId.toString(),
                like.authorLogin,
            ))
        return new ExtendedLikesInfo(
            mappedLikesInfo.likesCount,
            mappedLikesInfo.dislikesCount,
            mappedLikesInfo.myStatus, newestLikesView
        )
    }
}