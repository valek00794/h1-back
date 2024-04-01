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
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const utils_1 = require("../utils");
exports.commentsRepository = {
    getComments(query, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {};
            if (postId) {
                findOptions = { postId: new mongodb_1.ObjectId(postId) };
            }
            const comments = yield db_1.commentsCollection
                .find(findOptions)
                .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize)
                .toArray();
            const commentsCount = yield db_1.commentsCollection.countDocuments(findOptions);
            return {
                pagesCount: Math.ceil(commentsCount / sanitizationQuery.pageSize),
                page: sanitizationQuery.pageNumber,
                pageSize: sanitizationQuery.pageSize,
                totalCount: commentsCount,
                items: comments.map(comment => this.mapToOutput(comment))
            };
        });
    },
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const comment = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!comment) {
                return false;
            }
            return comment;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const comment = yield db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (comment.deletedCount === 0) {
                return false;
            }
            return true;
        });
    },
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
            yield db_1.commentsCollection.insertOne(newComment);
            return this.mapToOutput(newComment);
        });
    },
    mapToOutput(comment) {
        return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userId
            },
            createdAt: comment.createdAt
        };
    },
};
