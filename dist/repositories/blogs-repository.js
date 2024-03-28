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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const utils_1 = require("../utils");
exports.blogsRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            const findOptions = sanitizationQuery.searchNameTerm !== null ? { name: { $regex: sanitizationQuery.searchNameTerm, $options: 'i' } } : {};
            const blogs = yield db_1.blogsCollection
                .find(findOptions)
                .sort(sanitizationQuery.sortBy, sanitizationQuery.sortDirection)
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize)
                .toArray();
            const blogsCount = yield db_1.blogsCollection.countDocuments(findOptions);
            return {
                pagesCount: Math.ceil(blogsCount / sanitizationQuery.pageSize),
                page: sanitizationQuery.pageNumber,
                pageSize: sanitizationQuery.pageSize,
                totalCount: blogsCount,
                items: blogs.map(blog => this.mapToOutput(blog))
            };
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog === null) {
                return false;
            }
            return this.mapToOutput(blog);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const blog = yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog.deletedCount === 0) {
                return false;
            }
            return true;
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const blogInsertId = (yield db_1.blogsCollection.insertOne(newBlog)).insertedId;
            return blogInsertId.toString();
        });
    },
    updateBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.findBlog(id);
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
            yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedblog });
            return true;
        });
    },
    mapToOutput(blog) {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    },
};
