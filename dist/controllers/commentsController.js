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
    constructor(commentsService, likesService, commentsQueryRepository, postsQueryRepository) {
        this.commentsService = commentsService;
        this.likesService = likesService;
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
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
            if (!comment) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const deleteResult = yield this.commentsService.deleteComment(comment, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.login);
            if (deleteResult.status === settings_1.ResultStatus.Forbidden) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
                    .send();
                return;
            }
            if (deleteResult.status === settings_1.ResultStatus.NoContent) {
                res
                    .status(settings_1.StatusCodes.NO_CONTENT_204)
                    .send();
                return;
            }
        });
    }
    createCommentForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const post = yield this.postsQueryRepository.findPost(req.params.postId);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
            }
            const createdResult = yield this.commentsService.createComment(req.body, req.params.postId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.login);
            const comment = this.commentsQueryRepository.mapToOutput(createdResult.data);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .send(comment);
            return;
        });
    }
    updateCommentForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
            if (!comment) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const updateResult = yield this.commentsService.updateComment(req.body, comment, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.login);
            if (updateResult.status === settings_1.ResultStatus.Forbidden) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
                    .send();
                return;
            }
            if (updateResult.status === settings_1.ResultStatus.NoContent) {
                res
                    .status(settings_1.StatusCodes.NO_CONTENT_204)
                    .send();
                return;
            }
        });
    }
    getCommentsForPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const post = yield this.postsQueryRepository.findPost(req.params.postId);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const query = req.query;
            const comments = yield this.commentsQueryRepository.getComments(req.params.postId, query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .send(comments);
        });
    }
    changeCommentLikeStatusController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.findComment(req.params.commentId);
            if (!comment) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            yield this.likesService.changeLikeStatus(req.params.commentId, req.body.likeStatus, req.user.userId, req.user.login);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
}
exports.CommentsController = CommentsController;
