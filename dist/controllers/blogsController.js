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
exports.BlogsController = void 0;
const inversify_1 = require("inversify");
const settings_1 = require("../settings");
const blogs_service_1 = require("../services/blogs-service");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
let BlogsController = class BlogsController {
    constructor(blogsService, blogsQueryRepository) {
        this.blogsService = blogsService;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    getBlogsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const blogs = yield this.blogsQueryRepository.getBlogs(query);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(blogs);
        });
    }
    findBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.findBlog(req.params.id);
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
            const blogIsDeleted = yield this.blogsService.deleteBlog(req.params.id);
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
            const createdBlog = yield this.blogsService.createBlog(req.body);
            const newBlog = this.blogsQueryRepository.mapToOutput(createdBlog);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newBlog);
        });
    }
    updateBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBlog = yield this.blogsService.updateBlog(req.body, req.params.id);
            if (!updatedBlog) {
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
};
exports.BlogsController = BlogsController;
exports.BlogsController = BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService,
        blogs_query_repository_1.BlogsQueryRepository])
], BlogsController);
