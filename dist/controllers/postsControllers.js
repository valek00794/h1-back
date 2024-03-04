"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostController = exports.createPostController = exports.deletePostController = exports.findPostController = exports.getPostsController = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
const getPostsController = (req, res) => {
    const posts = posts_repository_1.postsRepository.getPosts();
    res
        .status(200)
        .json(posts);
};
exports.getPostsController = getPostsController;
const findPostController = (req, res) => {
    const post = posts_repository_1.postsRepository.findPost(req.params.id);
    if (post) {
        res
            .status(200)
            .json(post);
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.findPostController = findPostController;
const deletePostController = (req, res) => {
    const postIsDeleted = posts_repository_1.postsRepository.deletePost(req.params.id);
    if (!postIsDeleted) {
        res
            .status(404)
            .send();
    }
    else {
        res
            .status(204)
            .send();
    }
};
exports.deletePostController = deletePostController;
const createPostController = (req, res) => {
    const newPost = posts_repository_1.postsRepository.createPost(req.body);
    if (newPost) {
        res
            .status(201)
            .json(newPost);
    }
    else {
        res
            .status(400)
            .send();
    }
};
exports.createPostController = createPostController;
const updatePostController = (req, res) => {
    const updatedPost = posts_repository_1.postsRepository.updatePost(req.body, req.params.id);
    if (updatedPost) {
        res
            .status(204)
            .send();
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.updatePostController = updatePostController;
