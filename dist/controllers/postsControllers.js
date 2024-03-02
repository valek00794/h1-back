"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostController = exports.deletePostController = exports.findPostController = exports.getPostsController = void 0;
const db_1 = require("../db/db");
const validationErrorsMassages = {
    id: 'Not found video with the requested ID',
};
let apiErrors = [];
const getPostsController = (req, res) => {
    res
        .status(200)
        .json(db_1.db.posts);
};
exports.getPostsController = getPostsController;
const findPostController = (req, res) => {
    apiErrors = [];
    const postId = db_1.db.posts.findIndex(post => post.id === req.params.id);
    if (postId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        res
            .status(200)
            .json(db_1.db.posts[postId]);
    }
};
exports.findPostController = findPostController;
const deletePostController = (req, res) => {
    apiErrors = [];
    const postId = db_1.db.posts.findIndex(post => post.id === req.params.id);
    if (postId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        db_1.db.posts.splice(postId, 1);
        res
            .status(204)
            .send();
    }
};
exports.deletePostController = deletePostController;
const createPostController = (req, res) => {
    var _a;
    const newId = Date.parse(new Date().toISOString()).toString();
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    const blogName = ((_a = db_1.db.blogs.find(blog => blog.id === blogId)) === null || _a === void 0 ? void 0 : _a.name) || '';
    const isValidate = true;
    if (isValidate) {
        const newPost = {
            id: newId,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName
        };
        db_1.db.posts.push(newPost);
        res
            .status(201)
            .json(newPost);
    }
    else {
        res
            .status(400)
            .json({
            errorsMessages: apiErrors
        });
    }
};
exports.createPostController = createPostController;
