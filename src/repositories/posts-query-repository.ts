import { ObjectId } from 'mongodb'

import { Post, PostDbType, PostView } from '../types/posts-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'
import { PostsModel } from '../db/mongo/posts.model'
import { Paginator } from '../types/result-types'
import { LikesQueryRepository } from './likes-query-repository'
import { ExtendedLikesInfo, LikeStatus } from '../types/likes-types'

export class PostsQueryRepository {
    constructor(
        protected likesQueryRepository: LikesQueryRepository,
    ) { }
    async getPosts(query: SearchQueryParametersType, blogId?: string, userId?: string): Promise<Paginator<PostView[]>> {
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

        const postsItems = await Promise.all(posts.map(async post => {
            const likesInfo = await this.likesQueryRepository.getLikesInfo(post.id)
            const mapedlikesInfo = this.likesQueryRepository.mapExtendedLikesInfo(likesInfo)
            return this.mapToOutput(post, mapedlikesInfo)
        }))

        return new Paginator<PostView[]>(
            sanitizationQuery.pageNumber,
            sanitizationQuery.pageSize,
            postsCount,
            postsItems
        )
    }

    async findPost(id: string, userId?: string): Promise<false | PostView> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const post = await PostsModel.findById(id)
        let outputPost
        if (post) {
            const likesInfo = await this.likesQueryRepository.getLikesInfo(post.id)
            const mapedlikesInfo = this.likesQueryRepository.mapExtendedLikesInfo(likesInfo)
            outputPost = this.mapToOutput(post, mapedlikesInfo)
        }
        return post && outputPost ? outputPost : false
    }

    mapToOutput(post: PostDbType, extendedLikesInfo?: ExtendedLikesInfo): PostView {
        const outPost = new Post(
            post.title,
            post.shortDescription,
            post.content,
            post.blogId,
            post.blogName,
            post.createdAt
        )
        const extendedLikesInfoView = extendedLikesInfo ?
            extendedLikesInfo :
            new ExtendedLikesInfo(0, 0, LikeStatus.None, [])
        return new PostView(outPost, post._id!, extendedLikesInfoView)
    }
}