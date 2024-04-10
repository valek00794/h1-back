import { ObjectId } from 'mongodb'

import { commentsCollection } from '../db/db'
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

        const comments = await commentsCollection
            .find(findOptions)
            .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)
            .toArray()

        const commentsCount = await commentsCollection.countDocuments(findOptions)

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
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })
        if (!comment) {
            return false
        }
        return this.mapToOutput(comment!)
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