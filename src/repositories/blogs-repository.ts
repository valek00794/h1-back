import { db } from '../db/db'
import { CreateBlogType, OutputBlogType } from '../types/blogs-types'

export const blogsRepository = {
    getBlogs() {
        return db.blogs
    },
    findBlog(id: string) {
        const blogId = db.blogs.findIndex(blog => blog.id === id)
        if (blogId === -1) {
            return false
        } else {
            return db.blogs[blogId]
        }
    },
    deleteBlog(id: string) {
        const blogId = db.blogs.findIndex(blog => blog.id === id)
        if (blogId === -1) {
            return false
        } else {
            db.blogs.splice(blogId, 1)
            return true
        }
    },
    createBlog(body: CreateBlogType) {
        const newId = Date.parse(new Date().toISOString()).toString()
        const name = body.name
        const description = body.description
        const websiteUrl = body.websiteUrl

        const newBlog: OutputBlogType = {
            id: newId,
            name,
            description,
            websiteUrl,
        }

        const newBlogsLength = db.blogs.push(newBlog)
        const isPushed = db.blogs.find((blog) => blog.id === newId);
        if (isPushed) {
            return db.blogs[newBlogsLength - 1]
        } else {
            return false
        }
    },
    updateBlog(body: CreateBlogType, id: string) {
        const blogId = db.blogs.findIndex(blog => blog.id === id);

        if (!blogId) {
            return false
        } else {
            const name = body.name
            const description = body.description
            const websiteUrl = body.websiteUrl

            const updatedblog: OutputBlogType = {
                id: db.blogs[blogId].id,
                name,
                description,
                websiteUrl,
            }
            return db.blogs[blogId] = { ...updatedblog }
        }
    }
}