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
exports.PostsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const posts_types_1 = require("../types/posts-types");
const utils_1 = require("../utils");
const posts_model_1 = require("../db/mongo/posts.model");
const result_types_1 = require("../types/result-types");
class PostsQueryRepository {
    getPosts(query, blogId) {
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
            return new result_types_1.Paginator(sanitizationQuery.pageNumber, sanitizationQuery.pageSize, postsCount, posts.map(post => this.mapToOutput(post)));
        });
    }
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const post = yield posts_model_1.PostsModel.findById(id);
            return post ? this.mapToOutput(post) : false;
        });
    }
    mapToOutput(post) {
        const outPost = new posts_types_1.Post(post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt);
        return new posts_types_1.PostView(outPost, post._id);
    }
}
exports.PostsQueryRepository = PostsQueryRepository;
