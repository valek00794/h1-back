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
exports.changeCommentLikeStatusController = exports.getCommentsForPostController = exports.updateCommentForPostController = exports.createCommentForPostController = exports.deleteCommentController = exports.findCommentController = void 0;
const comments_query_repository_1 = require("../repositories/comments-query-repository");
const posts_query_repository_1 = require("../repositories/posts-query-repository");
const comments_service_1 = require("../services/comments-service");
const settings_1 = require("../settings");
const findCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    if (!comment) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(settings_1.StatusCodes.OK_200)
        .json(comment);
});
exports.findCommentController = findCommentController;
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const commentatorInfo = {
        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
        userLogin: (_c = req.user) === null || _c === void 0 ? void 0 : _c.login
    };
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.commentId);
    if (!comment) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(settings_1.StatusCodes.FORBIDDEN_403)
            .send();
        return;
    }
    yield comments_service_1.commentsService.deleteComment(req.params.commentId);
    res
        .status(settings_1.StatusCodes.NO_CONTENT_204)
        .send();
});
exports.deleteCommentController = deleteCommentController;
const createCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const post = yield posts_query_repository_1.postsQueryRepository.findPost(req.params.postId);
    if (!post) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    const commentatorInfo = {
        userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId,
        userLogin: (_e = req.user) === null || _e === void 0 ? void 0 : _e.login
    };
    const createdComment = yield comments_service_1.commentsService.createComment(req.body, commentatorInfo, req.params.postId);
    const comment = comments_query_repository_1.commentsQueryRepository.mapToOutput(createdComment);
    res
        .status(settings_1.StatusCodes.CREATED_201)
        .send(comment);
});
exports.createCommentForPostController = createCommentForPostController;
const updateCommentForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.commentId);
    if (!comment) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    const commentatorInfo = {
        userId: (_f = req.user) === null || _f === void 0 ? void 0 : _f.userId,
        userLogin: (_g = req.user) === null || _g === void 0 ? void 0 : _g.login
    };
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(settings_1.StatusCodes.FORBIDDEN_403)
            .send();
        return;
    }
    yield comments_service_1.commentsService.updateComment(req.body, comment);
    res
        .status(settings_1.StatusCodes.NO_CONTENT_204)
        .send();
});
exports.updateCommentForPostController = updateCommentForPostController;
const getCommentsForPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const query = req.query;
    const post = yield posts_query_repository_1.postsQueryRepository.findPost(req.params.postId);
    if (!post) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    const comments = yield comments_query_repository_1.commentsQueryRepository.getComments(req.params.postId, query, (_h = req.user) === null || _h === void 0 ? void 0 : _h.userId);
    res
        .status(settings_1.StatusCodes.OK_200)
        .send(comments);
});
exports.getCommentsForPostController = getCommentsForPostController;
const changeCommentLikeStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.userId) {
        res
            .status(settings_1.StatusCodes.UNAUTHORIZED_401)
            .send();
        return;
    }
    const comment = yield comments_query_repository_1.commentsQueryRepository.findComment(req.params.commentId);
    if (!comment) {
        res
            .status(settings_1.StatusCodes.NOT_FOUND_404)
            .send();
        return;
    }
    yield comments_service_1.commentsService.changeCommentLikeStatus(req.params.commentId, req.body.likeStatus, req.user.userId);
    res
        .status(settings_1.StatusCodes.NO_CONTENT_204)
        .send();
});
exports.changeCommentLikeStatusController = changeCommentLikeStatusController;
