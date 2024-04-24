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
exports.blogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../repositories/blogs-repository");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
exports.blogsService = {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const createdBlog = yield blogs_repository_1.blogsRepository.createBlog(newBlog);
            return blogs_query_repository_1.blogsQueryRepository.mapToOutput(createdBlog);
        });
    },
    updateBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(id);
            if (!blog) {
                return false;
            }
            const updatedblog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: false,
            };
            const res = yield blogs_repository_1.blogsRepository.updateBlog(updatedblog, id);
            if (res === null) {
                return false;
            }
            return true;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            return yield blogs_repository_1.blogsRepository.deleteBlog(id);
        });
    },
};
