import { ObjectId } from 'mongodb'

import { CommentsModel } from '../db/mongo/comments.model'
import { CommentDbType, CommentView } from '../types/comments-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'
import { LikeStatus, LikeStatusParrent, LikesInfoView } from '../types/likes-types'
import { Paginator } from '../types/result-types'
import { LikesQueryRepository } from './likes-query-repository'

export class CommentsQueryRepository {
    constructor(
        protected likesQueryRepository: LikesQueryRepository,
    ) { }
    async getComments(postId: string, query?: SearchQueryParametersType, userId?: string): Promise<Paginator<CommentView[]>> {

        const sanitizationQuery = getSanitizationQuery(query)
        let findOptions = {}
        if (postId) {
            findOptions = { postId: new ObjectId(postId) }
        }

        const comments = await CommentsModel
            .find(findOptions)
            .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)

        const commentsCount = await CommentsModel.countDocuments(findOptions)

        const commentsItems = await Promise.all(comments.map(async comment => {
            const likesInfo = await this.likesQueryRepository.getLikesInfo(comment.id, LikeStatusParrent.Comment)
            const mapedlikesInfo = this.likesQueryRepository.mapLikesInfo(userId!, likesInfo!)
            return this.mapToOutput(comment, mapedlikesInfo)
        }))

        return new Paginator<CommentView[]>(
            sanitizationQuery.pageNumber,
            sanitizationQuery.pageSize,
            commentsCount,
            commentsItems
        )
    }

    async findComment(id: string, userId?: string): Promise<CommentView | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await CommentsModel.findById(id)
        let outputComment
        if (comment) {
            const likesInfo = await this.likesQueryRepository.getLikesInfo(id, LikeStatusParrent.Comment)
            const mapedlikesInfo = this.likesQueryRepository.mapLikesInfo(userId!, likesInfo!)
            outputComment = this.mapToOutput(comment, mapedlikesInfo)
        }
        return comment && outputComment ? outputComment : false
    }

    mapToOutput(comment: CommentDbType, likesInfo?: LikesInfoView): CommentView {
        return new CommentView(
            comment._id!,
            comment.content,
            {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            comment.createdAt,
            {
                likesCount: likesInfo?.likesCount || 0,
                dislikesCount: likesInfo?.dislikesCount || 0,
                myStatus: likesInfo?.myStatus || LikeStatus.None
            }
        )
    }
}