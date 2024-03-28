import { ObjectId } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogDBType, BlogType, PaginatorBlogViewType } from '../types/blogs-types'
import { getSanitizationQuery } from '../utils'

export const blogsRepository = {
    async getBlogs(query?: any): Promise<PaginatorBlogViewType> {
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
    async findBlog(id: string) {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
        if (blog === null) {
            return false
        }
        return this.mapToOutput(blog)
    },

    async deleteBlog(id: string) {
        if (!ObjectId.isValid(id)) {
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
}