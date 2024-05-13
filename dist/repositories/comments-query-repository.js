"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CommentsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const comments_model_1 = require("../db/mongo/comments.model");
const comments_types_1 = require("../types/comments-types");
const utils_1 = require("../utils");
const likes_types_1 = require("../types/likes-types");
const result_types_1 = require("../types/result-types");
const likes_query_repository_1 = require("./likes-query-repository");
let CommentsQueryRepository = class CommentsQueryRepository {
    constructor(likesQueryRepository) {
        this.likesQueryRepository = likesQueryRepository;
    }
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
                const likesInfo = yield this.likesQueryRepository.getLikesInfo(comment.id);
                const mapedlikesInfo = this.likesQueryRepository.mapLikesInfo(likesInfo, userId);
                return this.mapToOutput(comment, mapedlikesInfo);
            })));
            return new result_types_1.Paginator(sanitizationQuery.pageNumber, sanitizationQuery.pageSize, commentsCount, commentsItems);
        });
    }
    findComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const comment = yield comments_model_1.CommentsModel.findById(id);
            let outputComment;
            if (comment) {
                const likesInfo = yield this.likesQueryRepository.getLikesInfo(id);
                const mapedlikesInfo = this.likesQueryRepository.mapLikesInfo(likesInfo, userId);
                outputComment = this.mapToOutput(comment, mapedlikesInfo);
            }
            return comment && outputComment ? outputComment : false;
        });
    }
    mapToOutput(comment, likesInfo) {
        return new comments_types_1.CommentView(comment._id, comment.content, {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        }, comment.createdAt, {
            likesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesCount) || 0,
            dislikesCount: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesCount) || 0,
            myStatus: (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.myStatus) || likes_types_1.LikeStatus.None
        });
    }
};
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.CommentsQueryRepository = CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [likes_query_repository_1.LikesQueryRepository])
], CommentsQueryRepository);
