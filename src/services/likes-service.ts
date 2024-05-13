import { injectable } from 'inversify';

import { LikeStatus } from "../types/likes-types"
import { ResultStatus } from "../settings"
import { Result } from "../types/result-types"
import { LikesRepository } from "../repositories/likes-repository"

@injectable()
export class LikesService {
    constructor(
        protected likesRepository: LikesRepository,
    ) { }

    async changeLikeStatus(parrentId: string, likeStatus: LikeStatus, userId: string, userLogin: string): Promise<Result<null>> {
        if (likeStatus === LikeStatus.None) {
            await this.likesRepository.deleteLikeInfo(parrentId, userId)
        } else {
            await this.likesRepository.updateLikeInfo(parrentId, userId, userLogin, likeStatus)
        }
        return new Result<null>(
            ResultStatus.NoContent,
            null,
            null
        )
    }
}