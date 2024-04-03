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
const comments_query_repository_1 = require("./comments-query-repository");
exports.commentsRepository = {
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
            return comments_query_repository_1.commentsQueryRepository.mapToOutput(newComment); //обычный repo не должен мапить данные
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
            yield db_1.commentsCollection.updateOne({ _id: comment.id }, { $set: updatedComment });
            return true;
        });
    },
};
