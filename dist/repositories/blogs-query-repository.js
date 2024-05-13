"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.BlogsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const blogs_types_1 = require("../types/blogs-types");
const utils_1 = require("../utils");
const blogs_model_1 = require("../db/mongo/blogs.model");
const result_types_1 = require("../types/result-types");
let BlogsQueryRepository = class BlogsQueryRepository {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizationQuery = (0, utils_1.getSanitizationQuery)(query);
            const findOptions = sanitizationQuery.searchNameTerm !== null ? { name: { $regex: sanitizationQuery.searchNameTerm, $options: 'i' } } : {};
            const blogs = yield blogs_model_1.BlogsModel
                .find(findOptions)
                .sort({ [sanitizationQuery.sortBy]: sanitizationQuery.sortDirection })
                .skip((sanitizationQuery.pageNumber - 1) * sanitizationQuery.pageSize)
                .limit(sanitizationQuery.pageSize);
            const blogsCount = yield blogs_model_1.BlogsModel.countDocuments(findOptions);
            return new result_types_1.Paginator(sanitizationQuery.pageNumber, sanitizationQuery.pageSize, blogsCount, blogs.map(blog => this.mapToOutput(blog)));
        });
    }
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            const blog = yield blogs_model_1.BlogsModel.findById(id);
            return blog ? this.mapToOutput(blog) : null;
        });
    }
    mapToOutput(blog) {
        const outBlog = new blogs_types_1.Blog(blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership);
        return new blogs_types_1.BlogView(outBlog, blog._id);
    }
};
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.BlogsQueryRepository = BlogsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsQueryRepository);
