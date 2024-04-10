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
exports.updateBlogController = exports.createBlogController = exports.deleteBlogController = exports.findBlogController = exports.getBlogsController = void 0;
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const blogs_service_1 = require("../services/blogs-service");
const result_types_1 = require("../types/result-types");
const getBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const blogs = yield blogs_query_repository_1.blogsQueryRepository.getBlogs(query);
    res
        .status(result_types_1.ResultStatus.OK_200)
        .json(blogs);
});
exports.getBlogsController = getBlogsController;
const findBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(req.params.id);
    if (!blog) {
        res
            .status(result_types_1.ResultStatus.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(result_types_1.ResultStatus.OK_200)
        .json(blog);
});
exports.findBlogController = findBlogController;
const deleteBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsDeleted = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (!blogIsDeleted) {
        res
            .status(result_types_1.ResultStatus.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(result_types_1.ResultStatus.NO_CONTENT_204)
        .send();
});
exports.deleteBlogController = deleteBlogController;
const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blogs_service_1.blogsService.createBlog(req.body);
    res
        .status(result_types_1.ResultStatus.CREATED_201)
        .json(newBlog);
});
exports.createBlogController = createBlogController;
const updateBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBlog = yield blogs_service_1.blogsService.updateBlog(req.body, req.params.id);
    if (!updatedBlog) {
        res
            .status(result_types_1.ResultStatus.NOT_FOUND_404)
            .send();
        return;
    }
    res
        .status(result_types_1.ResultStatus.NO_CONTENT_204)
        .send();
});
exports.updateBlogController = updateBlogController;
