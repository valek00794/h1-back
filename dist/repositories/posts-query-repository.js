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
exports.postsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const utils_1 = require("../utils");
exports.postsQueryRepository = {
    getPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            let findOptions = {};
            if (blogId) {
                findOptions = { blogId: new mongodb_1.ObjectId(blogId) };
            }
            const posts = yield db_1.postsCollection
                .find(findOptions)
                .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize)
                .toArray();
            const postsCount = yield db_1.postsCollection.countDocuments(findOptions);
            return {
                pagesCount: Math.ceil(postsCount / sanitizationQuery.pageSize),
                page: sanitizationQuery.pageNumber,
                pageSize: sanitizationQuery.pageSize,
                totalCount: postsCount,
                items: posts.map(post => this.mapToOutput(post))
            };
        });
    },
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const post = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!post) {
                return false;
            }
            return this.mapToOutput(post);
        });
    },
    mapToOutput(post) {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        };
    },
};
