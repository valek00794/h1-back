import { LikesStatusModel } from '../db/mongo/commentLikesStatus-model'
import { LikeStatusParrent, LikesInfo } from '../types/likes-types'

export class LikesRepository {
    async createLikeInfo(parrentId: string, parrentName: LikeStatusParrent): Promise<LikesInfo> {
        const likesInfo = new LikesStatusModel({
            parrentId,
            parrentName,
            likesUsersIds: [],
            dislikesUsersIds: []
        })
        await likesInfo.save()
        return likesInfo
    }

    async likeEntity(entityId: string, userId: string, parrentName: LikeStatusParrent): Promise<LikesInfo | null> {
        await this.removeEntityLikeStatus(entityId, userId, parrentName)
        return await LikesStatusModel.findOneAndUpdate(
            { parrentId: entityId, parrentName },
            { $addToSet: { likesUsersIds: userId } },
            { new: true }
        )
    }

    async dislikeEntity(entityId: string, userId: string, parrentName: LikeStatusParrent): Promise<LikesInfo | null> {
        await this.removeEntityLikeStatus(entityId, userId, parrentName)
        return await LikesStatusModel.findOneAndUpdate(
            { parrentId: entityId, parrentName },
            { $addToSet: { dislikesUsersIds: userId } },
            { new: true }
        )
    }

    async removeEntityLikeStatus(entityId: string, userId: string, parrentName: LikeStatusParrent): Promise<LikesInfo | null> {
        return await LikesStatusModel.findOneAndUpdate(
            { parrentId: entityId, parrentName },
            {
                $pull: { likesUsersIds: userId, dislikesUsersIds: userId }
            },
            { new: true }
        )
    }
}