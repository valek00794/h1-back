import { db } from '../db/db'
import { CreatePostType, OutputPostType } from '../types/posts-types'

export const postsRepository = {
    getPosts() {
        return db.posts
    },
    findPost(id: string) {
        const postId = db.posts.findIndex(post => post.id === id)
        if (postId === -1) {
            return false
        } else {
            return db.posts[postId]
        }
    },
    deletePost(id: string) {
        const postId = db.posts.findIndex(post => post.id === id)
        if (postId === -1) {
            return false
        } else {
            db.posts.splice(postId, 1)
            return true
        }
    },
    createPost(body: CreatePostType) {
        const newId = Date.parse(new Date().toISOString()).toString()
        const title = body.title
        const shortDescription = body.shortDescription
        const content = body.content
        const blogId = body.blogId
        const blogName = db.blogs.find(blog => blog.id === blogId)?.name || ''
        const newPost: OutputPostType = {
            id: newId,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName
        }
        const newPostsLength = db.posts.push(newPost);
        const isPushed = db.posts.find((post) => post.id === newId);
        if (isPushed) {
            return db.posts[newPostsLength - 1]
        } else {
            return false
        }
    },
    updatePost(body: CreatePostType, id: string) {
        const postId = db.posts.findIndex(post => post.id === id);

        if (!postId) {
            return false
        } else {
            const title = body.title
            const shortDescription = body.shortDescription
            const content = body.content
            const blogId = body.blogId
            const blogName = db.blogs.find(blog => blog.id === blogId)?.name || ''
            const updatedPost: OutputPostType = {
                id: db.posts[postId].id,
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogName
            }
            return db.posts[postId] = { ...updatedPost }
        }
    }
}