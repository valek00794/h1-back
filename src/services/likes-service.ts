import { LikeStatus } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"

import { LikesRepository } from "../repositories/likes-repository"

export class LikesService {
    constructor(
        protected likesRepository: LikesRepository,
    ) { }

    async changeLikeStatus(parrentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<null>> {
        const likeInfo = await this.likesRepository.getLikeInfo(parrentId, userId)
        if (likeInfo === null) {
            await this.likesRepository.createLikeInfo(parrentId, userId, likeStatus)
        } else {
            await this.likesRepository.updateLikeInfo(parrentId, userId, likeStatus)
        }
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}