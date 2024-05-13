import { LikeStatusModel } from '../db/mongo/likeStatus-model'
import { LikeStatus, LikesInfo, LikesInfoView } from '../types/likes-types'

export class LikesQueryRepository {
    async getLikesInfo(parrentId: string): Promise<LikesInfo[]> {
        return await LikeStatusModel.find({ parrentId })
    }

    mapLikesInfo(userId: string, likesInfo: LikesInfo[]): LikesInfoView {
        const likesInfoView = new LikesInfoView(
            likesInfo.filter(like => like.status === LikeStatus.Like).length,
            likesInfo.filter(like => like.status === LikeStatus.Dislike).length,
            likesInfo.find(like => like.authorId.toHexString() === userId)?.status || LikeStatus.None
        )
        return likesInfoView
    }

}