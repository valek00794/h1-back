import { ObjectId } from 'mongodb'
import { commentsCollection } from '../db/db'
import { CommentDbType, PaginatorCommentsViewType } from '../types/comments-types'
import { getSanitizationQuery } from '../utils'


export const commentsRepository = {
    async getComments(query: any, postId?: string): Promise<PaginatorCommentsViewType> {
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

    async findComment(id: string) {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })
        if (!comment) {
            return false
        }
        return comment!
    },

    async deleteComment(id: string) {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
        if (comment.deletedCount === 0) {
            return false
        }
        return true

    },
    mapToOutput(post: CommentDbType) {
        return {
            id: post._id,
            content: post.content,
            commentatorInfo: {
                userId: post.commentatorInfo.userId,
                userLogin: post.commentatorInfo.userId
            },
            createdAt: post.createdAt
        }
    },

}