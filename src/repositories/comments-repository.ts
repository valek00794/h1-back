import { ObjectId } from 'mongodb'
import { commentsCollection } from '../db/db'
import { CommentDbType, CommentInputType, CommentType, CommentatorInfo, PaginatorCommentsViewType } from '../types/comments-types'
import { getSanitizationQuery } from '../utils'
import { postsRepository } from './posts-repository'


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

    async createComment(body: CommentInputType, commentatorInfo: CommentatorInfo, postId?: string) {
        const newComment: CommentDbType = {
            content: body.content,
            postId: new ObjectId(postId),
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            }
        }
        await commentsCollection.insertOne(newComment)
        return this.mapToOutput(newComment)
    },
    mapToOutput(comment: CommentDbType) {
        return {
            id: comment._id!,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userId
            },
            createdAt: comment.createdAt
        }
    },

}