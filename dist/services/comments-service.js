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
exports.CommentsService = void 0;
const mongodb_1 = require("mongodb");
const comments_types_1 = require("../types/comments-types");
const users_types_1 = require("../types/users-types");
const settings_1 = require("../settings");
const result_types_1 = require("../types/result-types");
class CommentsService {
    constructor(commentsRepository, postsRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
    }
    createComment(body, postId, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentatorInfo = new users_types_1.CommentatorInfo(userId, userLogin);
            const newComment = new comments_types_1.Comment(body.content, {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin,
            }, new Date().toISOString(), new mongodb_1.ObjectId(postId));
            const comment = yield this.commentsRepository.createComment(newComment);
            return new result_types_1.Result(settings_1.ResultStatus.Created, comment, null);
        });
    }
    updateComment(body, comment, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentatorInfo = new users_types_1.CommentatorInfo(userId, userLogin);
            if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
                comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
                return new result_types_1.Result(settings_1.ResultStatus.Forbidden, null, null);
            }
            const updatedComment = new comments_types_1.Comment(body.content, {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            }, comment.createdAt, comment.postId);
            yield this.commentsRepository.updateComment(updatedComment, comment.id.toString());
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
    deleteComment(comment, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentatorInfo = new users_types_1.CommentatorInfo(userId, userLogin);
            if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
                comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
                return new result_types_1.Result(settings_1.ResultStatus.Forbidden, null, null);
            }
            yield this.commentsRepository.deleteComment(comment.id.toString());
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
}
exports.CommentsService = CommentsService;
