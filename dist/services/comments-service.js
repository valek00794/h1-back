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
exports.commentsService = void 0;
const mongodb_1 = require("mongodb");
const comments_repository_1 = require("../repositories/comments-repository");
const likes_types_1 = require("../types/likes-types");
const settings_1 = require("../settings");
exports.commentsService = {
    createComment(body, commentatorInfo, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                content: body.content,
                postId: new mongodb_1.ObjectId(postId),
                createdAt: new Date().toISOString(),
                commentatorInfo: {
                    userId: commentatorInfo.userId,
                    userLogin: commentatorInfo.userLogin,
                }
            };
            return yield comments_repository_1.commentsRepository.createComment(newComment);
        });
    },
    updateComment(body, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = {
                content: body.content,
                postId: comment.postId,
                createdAt: comment.createdAt,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin,
                }
            };
            return yield comments_repository_1.commentsRepository.updateComment(updatedComment, comment.id.toString());
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            return yield comments_repository_1.commentsRepository.deleteComment(id);
        });
    },
    changeCommentLikeStatus(commentId, likeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (likeStatus === likes_types_1.LikeStatus.Like) {
                yield comments_repository_1.commentsRepository.likeComment(commentId, userId);
            }
            if (likeStatus === likes_types_1.LikeStatus.Dislike) {
                yield comments_repository_1.commentsRepository.dislikeComment(commentId, userId);
            }
            if (likeStatus === likes_types_1.LikeStatus.None) {
                yield comments_repository_1.commentsRepository.removeLikeStatusComment(commentId, userId);
            }
            return {
                status: settings_1.ResultStatus.NoContent,
                data: null
            };
        });
    },
};
