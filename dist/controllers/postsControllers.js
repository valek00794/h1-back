"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostController = exports.createPostController = exports.deletePostController = exports.findPostController = exports.getPostsController = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
const getPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield posts_repository_1.postsRepository.getPosts();
    res
        .status(200)
        .json(posts);
});
exports.getPostsController = getPostsController;
const findPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postsRepository.findPost(req.params.id);
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
});
exports.findPostController = findPostController;
const deletePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsDeleted = yield posts_repository_1.postsRepository.deletePost(req.params.id);
    if (postIsDeleted) {
        res
            .status(204)
            .send();
    }
    else {
        res
            .status(404)
            .send();
    }
});
exports.deletePostController = deletePostController;
const createPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_repository_1.postsRepository.createPost(req.body);
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
});
exports.createPostController = createPostController;
const updatePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPost = yield posts_repository_1.postsRepository.updatePost(req.body, req.params.id);
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
});
exports.updatePostController = updatePostController;
