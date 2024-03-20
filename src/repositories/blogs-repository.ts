import { ObjectId, SortDirection } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogDBType, BlogType, PaginatorBlogViewType } from '../types/blogs-types'
import { SearchQueryParametersType } from '../types/query-types'

const defaultSearchQueryParameters = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc' as SortDirection,
    searchNameTerm: null
}


export const blogsRepository = {
    async getBlogs(query?: any): Promise<PaginatorBlogViewType> {
        const sanitizationQuery = this.getSanitizationQuery(query)
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
    async findBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
            return false
        }
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
        if (blog === null) {
            return false
        }
        return this.mapToOutput(blog)
    },

    async deleteBlog(id: string) {
        if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
            return false
        }
        const blog = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        if (blog.deletedCount === 0) {
            return false
        }
        return true
    },
    async createBlog(body: BlogType) {
        const newBlog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blogInsertId = (await blogsCollection.insertOne(newBlog)).insertedId
        return blogInsertId.toString()
    },
    async updateBlog(body: BlogType, id: string) {
        const blog = await this.findBlog(id)
        if (!blog) {
            return false
        }
        const updatedblog: BlogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false,
        }
        await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedblog })
        return true
    },
    mapToOutput(blog: BlogDBType) {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    },
    getSanitizationQuery(query?: SearchQueryParametersType) {
        return {
            pageNumber: query?.pageNumber ? +query.pageNumber : defaultSearchQueryParameters.pageNumber,
            pageSize: query?.pageSize ? +query.pageSize : defaultSearchQueryParameters.pageSize,
            sortBy: query?.sortBy ? query.sortBy : defaultSearchQueryParameters.sortBy,
            sortDirection: query?.sortDirection ? query.sortDirection : defaultSearchQueryParameters.sortDirection,
            searchNameTerm: query?.searchNameTerm ? query.searchNameTerm : defaultSearchQueryParameters.searchNameTerm,
        }
    }
}