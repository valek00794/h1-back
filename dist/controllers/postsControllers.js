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
exports.postsController = void 0;
const posts_query_repository_1 = require("../repositories/posts-query-repository");
const posts_service_1 = require("../services/posts-service");
const settings_1 = require("../settings");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
class PostsController {
    getPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const posts = yield posts_query_repository_1.postsQueryRepository.getPosts(query);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(posts);
        });
    }
    findPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_query_repository_1.postsQueryRepository.findPost(req.params.id);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(post);
        });
    }
    findPostsOfBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(req.params.blogId);
            if (!blog) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const posts = yield posts_query_repository_1.postsQueryRepository.getPosts(query, req.params.blogId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(posts);
        });
    }
    deletePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postIsDeleted = yield posts_service_1.postsService.deletePost(req.params.id);
            if (!postIsDeleted) {
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
    createPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield posts_service_1.postsService.createPost(req.body);
            const newPost = posts_query_repository_1.postsQueryRepository.mapToOutput(createdPost);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newPost);
        });
    }
    createPostForBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlog(req.params.blogId);
            if (!blog) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const createdPost = yield posts_service_1.postsService.createPost(req.body, req.params.blogId);
            const newPost = posts_query_repository_1.postsQueryRepository.mapToOutput(createdPost);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newPost);
        });
    }
    updatePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdatedPost = yield posts_service_1.postsService.updatePost(req.body, req.params.id);
            if (!isUpdatedPost) {
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
}
exports.postsController = new PostsController();
