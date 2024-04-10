import { ObjectId } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogDBType, BlogViewType, PaginatorBlogViewType } from '../types/blogs-types'
import { getSanitizationQuery } from '../utils'
import { SearchQueryParametersType } from '../types/query-types'

export const blogsQueryRepository = {
    async getBlogs(query?: SearchQueryParametersType): Promise<PaginatorBlogViewType> {
        const sanitizationQuery = getSanitizationQuery(query)
        const findOptions = sanitizationQuery.searchNameTerm !== null ? { name: { $regex: sanitizationQuery.searchNameTerm, $options: 'i' } } : {}

        const blogs = await blogsCollection
            .find(findOptions)
            .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
            .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
            .limit(sanitizationQuery.pageSize)
            .toArray()

        const blogsCount = await blogsCollection.countDocuments(findOptions)

        return {
            pagesCount: Math.ceil(blogsCount / sanitizationQuery.pageSize),
            page: sanitizationQuery.pageNumber,
            pageSize: sanitizationQuery.pageSize,
            totalCount: blogsCount,
            items: blogs.map(blog => this.mapToOutput(blog))
        }
    },

    async findBlog(id: string): Promise<false | BlogViewType> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
        if (blog === null) {
            return false
        }
        return this.mapToOutput(blog)
    },

    mapToOutput(blog: BlogDBType): BlogViewType {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    },
}