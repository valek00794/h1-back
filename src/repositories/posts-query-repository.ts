import { ObjectId } from 'mongodb'

import { PostDbType, PostViewType } from '../types/posts-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'
import { PostsModel } from '../db/mongo/posts.model'
import { Paginator } from '../types/result-types'

class PostsQueryRepository {
    async getPosts(query: SearchQueryParametersType, blogId?: string): Promise<Paginator<PostViewType[]>> {
        const sanitizationQuery = getSanitizationQuery(query)
        let findOptions = {}
        if (blogId) {
            findOptions = { blogId: new ObjectId(blogId) }
        }

        const posts = await PostsModel
            .find(findOptions)
            .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)

        const postsCount = await PostsModel.countDocuments(findOptions)

        return new Paginator<PostViewType[]>(
            Math.ceil(postsCount / sanitizationQuery.pageSize),
            sanitizationQuery.pageNumber,
            sanitizationQuery.pageSize,
            postsCount,
            posts.map(post => this.mapToOutput(post))
        )
    }

    async findPost(id: string): Promise<false | PostViewType> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await PostsModel.findById(id)
        return post ? this.mapToOutput(post) : false
    }

    mapToOutput(post: PostDbType): PostViewType {
        return {
            id: post._id!,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}

export const postsQueryRepository = new PostsQueryRepository()