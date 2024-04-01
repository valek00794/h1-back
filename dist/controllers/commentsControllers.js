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
exports.createCommentForPostController = exports.deleteCommentController = exports.findCommentController = exports.findCommentsOfPostController = void 0;
const settings_1 = require("../settings");
const comments_repository_1 = require("../repositories/comments-repository");
const posts_repository_1 = require("../repositories/posts-repository");
const findCommentsOfPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postsRepository.findPost(req.params.id);
    if (!post) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const posts = yield comments_repository_1.commentsRepository.getComments(req.query, req.params.blogId);
    res
        .status(settings_1.CodeResponses.OK_200)
        .json(posts);
});
exports.findCommentsOfPostController = findCommentsOfPostController;
const findCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_repository_1.commentsRepository.findComment(req.params.id);
    if (!comment) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(settings_1.CodeResponses.OK_200)
        .json(comment);
});
exports.findCommentController = findCommentController;
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentIsDeleted = yield comments_repository_1.commentsRepository.deleteComment(req.params.id);
    if (!commentIsDeleted) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
});
exports.deleteCommentController = deleteCommentController;
const createCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postsRepository.findPost(req.params.postId);
    if (!post) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const comment = yield comments_repository_1.commentsRepository.createComment(req.body, req.commentatorInfo, req.params.postId);
    if (!comment) {
        res
            .status(settings_1.CodeResponses.BAD_REQUEST_400)
            .send();
        return;
    }
});
exports.createCommentForPostController = createCommentForPostController;
