"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
exports.blogsRepository = {
    getBlogs() {
        return db_1.db.blogs;
    },
    findBlog(id) {
        const blogId = db_1.db.blogs.findIndex(blog => blog.id === id);
        if (blogId === -1) {
            return false;
        }
        else {
            return db_1.db.blogs[blogId];
        }
    },
    deleteBlog(id) {
        const blogId = db_1.db.blogs.findIndex(blog => blog.id === id);
        if (blogId === -1) {
            return false;
        }
        else {
            db_1.db.blogs.splice(blogId, 1);
            return true;
        }
    },
    createBlog(body) {
        const newId = Date.parse(new Date().toISOString()).toString();
        const name = body.name;
        const description = body.description;
        const websiteUrl = body.websiteUrl;
        const newBlog = {
            id: newId,
            name,
            description,
            websiteUrl,
        };
        const newBlogsLength = db_1.db.blogs.push(newBlog);
        const isPushed = db_1.db.blogs.find((blog) => blog.id === newId);
        if (isPushed) {
            return db_1.db.blogs[newBlogsLength - 1];
        }
        else {
            return false;
        }
    },
    updateBlog(body, id) {
        const blogId = db_1.db.blogs.findIndex(blog => blog.id === id);
        if (!blogId) {
            return false;
        }
        else {
            const name = body.name;
            const description = body.description;
            const websiteUrl = body.websiteUrl;
            const updatedblog = {
                id: db_1.db.blogs[blogId].id,
                name,
                description,
                websiteUrl,
            };
            return db_1.db.blogs[blogId] = Object.assign({}, updatedblog);
        }
    }
};
