"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
exports.postsRepository = {
    getPosts() {
        return db_1.db.posts;
    },
    findPost(id) {
        const postId = db_1.db.posts.findIndex(post => post.id === id);
        if (postId === -1) {
            return false;
        }
        else {
            return db_1.db.posts[postId];
        }
    },
    deletePost(id) {
        const postId = db_1.db.posts.findIndex(post => post.id === id);
        if (postId === -1) {
            return false;
        }
        else {
            db_1.db.posts.splice(postId, 1);
            return true;
        }
    },
    createPost(body) {
        var _a;
        const newId = Date.parse(new Date().toISOString()).toString();
        const title = body.title;
        const shortDescription = body.shortDescription;
        const content = body.content;
        const blogId = body.blogId;
        const blogName = ((_a = db_1.db.blogs.find(blog => blog.id === blogId)) === null || _a === void 0 ? void 0 : _a.name) || '';
        const newPost = {
            id: newId,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName
        };
        const newPostsLength = db_1.db.posts.push(newPost);
        const isPushed = db_1.db.posts.find((post) => post.id === newId);
        if (isPushed) {
            return db_1.db.posts[newPostsLength - 1];
        }
        else {
            return false;
        }
    },
    updatePost(body, id) {
        var _a;
        const postId = db_1.db.posts.findIndex(post => post.id === id);
        if (postId === -1) {
            return false;
        }
        else {
            const title = body.title;
            const shortDescription = body.shortDescription;
            const content = body.content;
            const blogId = body.blogId;
            const blogName = ((_a = db_1.db.blogs.find(blog => blog.id === blogId)) === null || _a === void 0 ? void 0 : _a.name) || '';
            const updatedPost = {
                id: db_1.db.posts[postId].id,
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogName
            };
            return db_1.db.posts[postId] = Object.assign({}, updatedPost);
        }
    }
};
