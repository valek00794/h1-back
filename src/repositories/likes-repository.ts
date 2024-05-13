import { injectable } from 'inversify';

import { LikeStatusModel } from '../db/mongo/likeStatus-model'
import { LikeStatus, LikesInfo } from '../types/likes-types'

@injectable()
export class LikesRepository {
    async updateLikeInfo(parrentId: string, authorId: string, authorLogin: string, status: LikeStatus): Promise<LikesInfo | null> {
        return await LikeStatusModel.findOneAndUpdate(
            { parrentId, authorId, authorLogin },
            {
                status,
                addedAt: new Date().toISOString()
            },
            { new: true, upsert: true }
        )
    }

    async deleteLikeInfo(parrentId: string, authorId: string): Promise<LikesInfo | null> {
        return await LikeStatusModel.findOneAndDelete(
            { parrentId, authorId }
        )
    }

    async getLikeInfo(parrentId: string, authorId: string) {
        return await LikeStatusModel.findOne({ parrentId, authorId })
    }
}