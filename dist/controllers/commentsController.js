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
exports.CommentsController = void 0;
const settings_1 = require("../settings");
class CommentsController {
    constructor(commentsService, commentsQueryRepository, postsQueryRepository) {
        this.commentsService = commentsService;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
    }
    findCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const comment = yield this.commentsQueryRepository.findComment(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
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
    }
    deleteCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const commentatorInfo = {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
                userLogin: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login
            };
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
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
            yield this.commentsService.deleteComment(req.params.commentId);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
    createCommentForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!req.user || !req.user.userId) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const post = yield this.postsQueryRepository.findPost(req.params.postId);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const commentatorInfo = {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
                userLogin: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login
            };
            const createdComment = yield this.commentsService.createComment(req.body, commentatorInfo, req.params.postId);
            const comment = this.commentsQueryRepository.mapToOutput(createdComment);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .send(comment);
        });
    }
    updateCommentForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!req.user || !req.user.userId) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
            if (!comment) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const commentatorInfo = {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
                userLogin: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login
            };
            if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
                comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
                    .send();
                return;
            }
            yield this.commentsService.updateComment(req.body, comment);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
    getCommentsForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = req.query;
            const post = yield this.postsQueryRepository.findPost(req.params.postId);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const comments = yield this.commentsQueryRepository.getComments(req.params.postId, query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .send(comments);
        });
    }
    changeCommentLikeStatusController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user || !req.user.userId) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
            if (!comment) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            yield this.commentsService.changeCommentLikeStatus(req.params.commentId, req.body.likeStatus, req.user.userId);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
}
exports.CommentsController = CommentsController;
