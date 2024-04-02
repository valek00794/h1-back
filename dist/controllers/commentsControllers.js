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
exports.getCommentsForPostController = exports.updateCommentForPostController = exports.createCommentForPostController = exports.deleteCommentController = exports.findCommentController = exports.findCommentsOfPostController = void 0;
const settings_1 = require("../settings");
const comments_repository_1 = require("../repositories/comments-repository");
const posts_repository_1 = require("../repositories/posts-repository");
const comments_query_repository_1 = require("../repositories/comments-query-repository");
const findCommentsOfPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postsRepository.findPost(req.params.id);
    if (!post) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const comments = yield comments_query_repository_1.commentsQueryRepository.getComments(req.query, req.params.blogId);
    res
        .status(settings_1.CodeResponses.OK_200)
        .json(comments);
});
exports.findCommentsOfPostController = findCommentsOfPostController;
const findCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.id);
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
    var _a, _b;
    const commentatorInfo = {
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        userLogin: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userLogin
    };
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.commentId);
    if (!comment) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(settings_1.CodeResponses.FORBIDDEN_403)
            .send();
        return;
    }
    yield comments_repository_1.commentsRepository.deleteComment(req.params.commentId);
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
});
exports.deleteCommentController = deleteCommentController;
const createCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.CodeResponses.UNAUTHORIZED_401)
            .send();
        return;
    }
    const post = yield posts_repository_1.postsRepository.findPost(req.params.postId);
    if (!post) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const commentatorInfo = {
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
        userLogin: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userLogin
    };
    const comment = yield comments_repository_1.commentsRepository.createComment(req.body, commentatorInfo, req.params.postId);
    res
        .status(settings_1.CodeResponses.CREATED_201)
        .send(comment);
});
exports.createCommentForPostController = createCommentForPostController;
const updateCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.CodeResponses.UNAUTHORIZED_401)
            .send();
        return;
    }
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.commentId);
    if (!comment) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const commentatorInfo = {
        userId: (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId,
        userLogin: (_f = req.user) === null || _f === void 0 ? void 0 : _f.userLogin
    };
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(settings_1.CodeResponses.FORBIDDEN_403)
            .send();
        return;
    }
    yield comments_repository_1.commentsRepository.updateComment(req.body, comment);
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
});
exports.updateCommentForPostController = updateCommentForPostController;
const getCommentsForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postsRepository.findPost(req.params.postId);
    if (!post) {
        res
            .status(settings_1.CodeResponses.NOT_FOUND_404)
            .send();
        return;
    }
    const comments = yield comments_query_repository_1.commentsQueryRepository.getComments(req.query, req.params.postId);
    res
        .status(settings_1.CodeResponses.OK_200)
        .send(comments);
});
exports.getCommentsForPostController = getCommentsForPostController;
