import { ObjectId } from 'mongodb'

import { CommentsModel } from '../db/mongo/comments.model'
import { CommentDbType, CommentViewType, PaginatorCommentsViewType } from '../types/comments-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'

export const commentsQueryRepository = {
    async getComments(query?: SearchQueryParametersType, postId?: string): Promise<PaginatorCommentsViewType> {
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

        return {
            pagesCount: Math.ceil(commentsCount / sanitizationQuery.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: commentsCount,
            items: comments.map(comment => this.mapToOutput(comment))
        }
    },

    async findComment(id: string): Promise<CommentViewType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await CommentsModel.findById(id)
        return comment ? this.mapToOutput(comment) : false
    },

    mapToOutput(comment: CommentDbType): CommentViewType {
        return {
            id: comment._id!,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    },

}