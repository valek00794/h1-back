import { ObjectId } from 'mongodb'

import { CommentsModel } from '../db/mongo/comments.model'
import { CommentDbType, CommentView } from '../types/comments-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'
import { CommentLikesStatusModel } from '../db/mongo/commentLikesStatus-model'
import { LikeStatus, LikesInfo, LikesInfoView } from '../types/likes-types'
import { Paginator } from '../types/result-types'

class CommentsQueryRepository {
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
            const likesInfo = await this.getLikesInfo(comment.id)
            const mapedlikesInfo = this.mapLikesInfo(userId!, likesInfo!)
            return this.mapToOutput(comment, mapedlikesInfo)
        }))

        return new Paginator<CommentView[]>(
            Math.ceil(commentsCount / sanitizationQuery.pageSize),
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
            const likesInfo = await this.getLikesInfo(id)
            const mapedlikesInfo = this.mapLikesInfo(userId!, likesInfo!)
            outputComment = this.mapToOutput(comment, mapedlikesInfo)
        }
        return comment && outputComment ? outputComment : false
    }

    async getLikesInfo(commentId: string) {
        return await CommentLikesStatusModel.findOne({ commentId })
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

    mapLikesInfo(userId: string, likesInfo?: LikesInfo) {
        let myLikeStatus = LikeStatus.None
        if (userId && likesInfo?.likesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Like
        }
        if (userId && likesInfo?.dislikesUsersIds.includes(userId)) {
            myLikeStatus = LikeStatus.Dislike
        }
        const likesCount = likesInfo?.likesUsersIds.length || 0
        const dislikesCount = likesInfo?.dislikesUsersIds.length || 0
        return new LikesInfoView(likesCount, dislikesCount, myLikeStatus)
    }
}

export const commentsQueryRepository = new CommentsQueryRepository()