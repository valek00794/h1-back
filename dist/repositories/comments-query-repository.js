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
exports.commentsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const comments_model_1 = require("../db/mongo/comments.model");
const utils_1 = require("../utils");
const commentLikesStatus_model_1 = require("../db/mongo/commentLikesStatus-model");
const likes_types_1 = require("../types/likes-types");
exports.commentsQueryRepository = {
    getComments(postId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {};
            if (postId) {
                findOptions = { postId: new mongodb_1.ObjectId(postId) };
            }
            const comments = yield comments_model_1.CommentsModel
                .find(findOptions)
                .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize);
            const commentsCount = yield comments_model_1.CommentsModel.countDocuments(findOptions);
            const commentsItems = yield Promise.all(comments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                const likesInfo = yield this.getLikesInfo(comment.id);
                const mapedlikesInfo = this.mapLikesInfo(userId, likesInfo);
                return this.mapToOutput(comment, mapedlikesInfo);
            })));
            return {
                pagesCount: Math.ceil(commentsCount / sanitizationQuery.pageSize),
                page: sanitizationQuery.pageNumber,
                pageSize: sanitizationQuery.pageSize,
                totalCount: commentsCount,
                items: commentsItems
            };
        });
    },
    findComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const comment = yield comments_model_1.CommentsModel.findById(id);
            let outputComment;
            if (comment) {
                const likesInfo = yield this.getLikesInfo(id);
                const mapedlikesInfo = this.mapLikesInfo(userId, likesInfo);
                outputComment = this.mapToOutput(comment, mapedlikesInfo);
            }
            return comment && outputComment ? outputComment : false;
        });
    },
    getLikesInfo(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commentLikesStatus_model_1.CommentLikesStatusModel.findOne({ commentId });
        });
    },
    mapToOutput(comment, likesInfo) {
        return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesCount) || 0,
                dislikesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesCount) || 0,
                myStatus: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.myStatus) || likes_types_1.LikeStatus.None
            }
        };
    },
    mapLikesInfo(userId, likesInfo) {
        let myLikeStatus = likes_types_1.LikeStatus.None;
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Like;
        }
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Dislike;
        }
        return {
            likesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.length) || 0,
            dislikesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.length) || 0,
            myStatus: myLikeStatus
        };
    }
};
