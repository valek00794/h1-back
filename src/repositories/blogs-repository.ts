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
        const newBlog: OutputBlogType = {
            id: newId,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
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
        const blogIndex = db.blogs.findIndex(blog => blog.id === id);
        console.log(blogIndex);
        if (blogIndex === -1) {
            return false
        } else {
            const updatedblog: OutputBlogType = {
                id: db.blogs[blogIndex].id,
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }
            return db.blogs[blogIndex] = { ...updatedblog }
        }
    }
}