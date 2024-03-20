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
const blogs_repository_1 = require("../repositories/blogs-repository");
const getBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogs_repository_1.blogsRepository.getBlogs(req.query);
    res
        .status(200)
        .json(blogs);
});
exports.getBlogsController = getBlogsController;
const findBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_1.blogsRepository.findBlog(req.params.id);
    if (!blog) {
        res
            .status(404)
            .send();
        return;
    }
    res
        .status(200)
        .json(blog);
});
exports.findBlogController = findBlogController;
const deleteBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (!blogIsDeleted) {
        res
            .status(404)
            .send();
        return;
    }
    res
        .status(204)
        .send();
});
exports.deleteBlogController = deleteBlogController;
const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogInsertedId = yield blogs_repository_1.blogsRepository.createBlog(req.body);
    const newBlog = yield blogs_repository_1.blogsRepository.findBlog(blogInsertedId);
    if (!newBlog) {
        res
            .status(404)
            .send();
        return;
    }
    res
        .status(201)
        .json(newBlog);
});
exports.createBlogController = createBlogController;
const updateBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBlog = yield blogs_repository_1.blogsRepository.updateBlog(req.body, req.params.id);
    if (!updatedBlog) {
        res
            .status(404)
            .send();
        return;
    }
    res
        .status(204)
        .send();
});
exports.updateBlogController = updateBlogController;
