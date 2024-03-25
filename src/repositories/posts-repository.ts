import { ObjectId, SortDirection } from 'mongodb'

import { postsCollection } from '../db/db'
import { CreatePostType, PaginatorPostViewType, PostDbType, PostType } from '../types/posts-types'
import { blogsRepository } from './blogs-repository'
import { SearchQueryParametersType } from '../types/query-types'

const defaultSearchQueryParameters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc' as SortDirection,
}

export const postsRepository = {
    async getPosts(query: any, blogId?: string): Promise<PaginatorPostViewType> {
        const sanitizationQuery = this.getSanitizationQuery(query)
        let findOptions = {}
        if (blogId) {
            findOptions = { blogId: new ObjectId(blogId) }
        }

        const posts = await postsCollection
            .find(findOptions)
            .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)
            .toArray()

        const postsCount = await postsCollection.countDocuments(findOptions)

        return {
            pagesCount: Math.ceil(postsCount / sanitizationQuery.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: postsCount,
            items: posts.map(post => this.mapToOutput(post))
        }
    },
    async findPost(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
            return false
        }
        const post = await postsCollection.findOne({ _id: new ObjectId(id) })
        if (!post) {
            return false
        }
        return this.mapToOutput(post!)
    },

    async deletePost(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
            return false
        }
        const post = await postsCollection.deleteOne({ _id: new ObjectId(id) })
        if (post.deletedCount === 0) {
            return false
        }
        return true

    },
    async createPost(body: CreatePostType, blogId?: string) {
        let getBlogId = blogId?.match(/^[0-9a-fA-F]{24}$/) ? blogId : body.blogId

        const newPost: PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(getBlogId),
            blogName: '',
            createdAt: new Date().toISOString()
        }
        const blog = await blogsRepository.findBlog(getBlogId)
        if (blog) {
            newPost.blogName = blog.name
        }
        const postInsert = await postsCollection.insertOne(newPost)
        return postInsert.insertedId.toString()
    },
    async updatePost(body: CreatePostType, id: string) {
        const post = await this.findPost(id)
        if (!post) {
            return false
        }
        const updatedPost: PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(body.blogId),
            blogName: '',
            createdAt: post.createdAt
        }
        const blog = await blogsRepository.findBlog(body.blogId.toString())
        if (blog) {
            updatedPost.blogName = blog.name
        }
        await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPost })
        return true
    },
    mapToOutput(post: PostDbType) {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    },
    getSanitizationQuery(query: SearchQueryParametersType) {
        return {
            pageNumber: query.pageNumber ? +query.pageNumber : defaultSearchQueryParameters.pageNumber,
            pageSize: query.pageSize ? +query.pageSize : defaultSearchQueryParameters.pageSize,
            sortBy: query.sortBy ? query.sortBy : defaultSearchQueryParameters.sortBy,
            sortDirection: query.sortDirection ? query.sortDirection : defaultSearchQueryParameters.sortDirection,
        }
    }
}