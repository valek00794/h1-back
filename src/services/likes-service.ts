import { LikeStatus, LikeStatusParrent } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"

import { LikesRepository } from "../repositories/likes-repository"

export class LikesService {
    constructor(
        protected likesRepository: LikesRepository,
    ) { }

    async changeLikeStatus(parrentId: string, parrentName: LikeStatusParrent, likeStatus: LikeStatus, userId: string): Promise<Result<null>> {
        if (likeStatus === LikeStatus.Like) {
            await this.likesRepository.likeEntity(parrentId, userId, parrentName)
        }
        if (likeStatus === LikeStatus.Dislike) {
            await this.likesRepository.dislikeEntity(parrentId, userId, parrentName)
        }
        if (likeStatus === LikeStatus.None) {
            await this.likesRepository.removeEntityLikeStatus(parrentId, userId, parrentName)
        }

        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}