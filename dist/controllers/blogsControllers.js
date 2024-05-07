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
exports.blogsController = void 0;
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const blogs_service_1 = require("../services/blogs-service");
const settings_1 = require("../settings");
class BlogsController {
    getBlogsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const blogs = yield blogs_query_repository_1.blogsQueryRepository.getBlogs(query);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(blogs);
        });
    }
    findBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(req.params.id);
            if (!blog) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(blog);
        });
    }
    deleteBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIsDeleted = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
            if (!blogIsDeleted) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
    createBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield blogs_service_1.blogsService.createBlog(req.body);
            const newBlog = blogs_query_repository_1.blogsQueryRepository.mapToOutput(createdBlog);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newBlog);
        });
    }
    updateBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(req.params.id);
            if (blog === null) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            yield blogs_service_1.blogsService.updateBlog(req.body, req.params.id);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
}
exports.blogsController = new BlogsController();
