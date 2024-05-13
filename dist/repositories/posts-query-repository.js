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
exports.PostsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const posts_types_1 = require("../types/posts-types");
const utils_1 = require("../utils");
const posts_model_1 = require("../db/mongo/posts.model");
const result_types_1 = require("../types/result-types");
const likes_query_repository_1 = require("./likes-query-repository");
const likes_types_1 = require("../types/likes-types");
let PostsQueryRepository = class PostsQueryRepository {
    constructor(likesQueryRepository) {
        this.likesQueryRepository = likesQueryRepository;
    }
    getPosts(query, blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {};
            if (blogId) {
                findOptions = { blogId: new mongodb_1.ObjectId(blogId) };
            }
            const posts = yield posts_model_1.PostsModel
                .find(findOptions)
                .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize);
            const postsCount = yield posts_model_1.PostsModel.countDocuments(findOptions);
            const postsItems = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const likesInfo = yield this.likesQueryRepository.getLikesInfo(post.id);
                const mapedlikesInfo = this.likesQueryRepository.mapExtendedLikesInfo(likesInfo);
                return this.mapToOutput(post, mapedlikesInfo);
            })));
            return new result_types_1.Paginator(sanitizationQuery.pageNumber, sanitizationQuery.pageSize, postsCount, postsItems);
        });
    }
    findPost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const post = yield posts_model_1.PostsModel.findById(id);
            let outputPost;
            if (post) {
                const likesInfo = yield this.likesQueryRepository.getLikesInfo(post.id);
                const mapedlikesInfo = this.likesQueryRepository.mapExtendedLikesInfo(likesInfo);
                outputPost = this.mapToOutput(post, mapedlikesInfo);
            }
            return post && outputPost ? outputPost : false;
        });
    }
    mapToOutput(post, extendedLikesInfo) {
        const outPost = new posts_types_1.Post(post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt);
        const extendedLikesInfoView = extendedLikesInfo ?
            extendedLikesInfo :
            new likes_types_1.ExtendedLikesInfo(0, 0, likes_types_1.LikeStatus.None, []);
        return new posts_types_1.PostView(outPost, post._id, extendedLikesInfoView);
    }
};
exports.PostsQueryRepository = PostsQueryRepository;
exports.PostsQueryRepository = PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [likes_query_repository_1.LikesQueryRepository])
], PostsQueryRepository);
