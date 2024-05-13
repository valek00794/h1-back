
import { LikeStatusModel } from '../db/mongo/likeStatus-model'
import { LikeStatus, LikesInfo } from '../types/likes-types'

export class LikesRepository {
    async createLikeInfo(parrentId: string, authorId: string, status: LikeStatus): Promise<LikesInfo> {
        const likesInfo = new LikeStatusModel({
            parrentId,
            authorId,
            status,
            addedAt: new Date().toISOString(),
        })
        await likesInfo.save()
        return likesInfo
    }

    async updateLikeInfo(parrentId: string, authorId: string, status: LikeStatus): Promise<LikesInfo | null> {
        return await LikeStatusModel.findOneAndUpdate(
            { parrentId, authorId },
            {
                status,
                addedAt: new Date().toISOString()
            },
            { new: true }
        )
    }

    async getLikeInfo(parrentId: string, authorId: string) {
        return await LikeStatusModel.findOne({ parrentId, authorId })
    }
}