import { ObjectId } from 'mongodb'

import { Post, PostDbType, PostView } from '../types/posts-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'
import { PostsModel } from '../db/mongo/posts.model'
import { Paginator } from '../types/result-types'

export class PostsQueryRepository {
    async getPosts(query: SearchQueryParametersType, blogId?: string): Promise<Paginator<PostView[]>> {
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

        return new Paginator<PostView[]>(
            sanitizationQuery.pageNumber,
            sanitizationQuery.pageSize,
            postsCount,
            posts.map(post => this.mapToOutput(post))
        )
    }

    async findPost(id: string): Promise<false | PostView> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await PostsModel.findById(id)
        return post ? this.mapToOutput(post) : false
    }

    mapToOutput(post: PostDbType): PostView {
        const outPost = new Post(
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt
        )
        return new PostView(outPost, post._id!)
    }
}