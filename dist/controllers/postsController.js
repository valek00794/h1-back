"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostController = exports.findPostController = exports.getPostsController = void 0;
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
