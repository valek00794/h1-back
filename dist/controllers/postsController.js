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
exports.PostsController = void 0;
const settings_1 = require("../settings");
class PostsController {
    constructor(postsService, likesService, postsQueryRepository, blogsQueryRepository) {
        this.postsService = postsService;
        this.likesService = likesService;
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    getPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = req.query;
            const posts = yield this.postsQueryRepository.getPosts(query, undefined, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(posts);
        });
    }
    findPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const post = yield this.postsQueryRepository.findPost(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
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
            const blog = yield this.blogsQueryRepository.findBlog(req.params.blogId);
            if (!blog) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const posts = yield this.postsQueryRepository.getPosts(query, req.params.blogId, req.user.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .json(posts);
        });
    }
    deletePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postIsDeleted = yield this.postsService.deletePost(req.params.id);
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
            const createdPost = yield this.postsService.createPost(req.body);
            const newPost = this.postsQueryRepository.mapToOutput(createdPost);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newPost);
        });
    }
    createPostForBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.findBlog(req.params.blogId);
            if (!blog) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            const createdPost = yield this.postsService.createPost(req.body, req.params.blogId);
            const newPost = this.postsQueryRepository.mapToOutput(createdPost);
            res
                .status(settings_1.StatusCodes.CREATED_201)
                .json(newPost);
        });
    }
    updatePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdatedPost = yield this.postsService.updatePost(req.body, req.params.id);
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
    changePostLikeStatusController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsQueryRepository.findPost(req.params.postId);
            if (!post) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            yield this.likesService.changeLikeStatus(req.params.postId, req.body.likeStatus, req.user.userId, req.user.login);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
        });
    }
}
exports.PostsController = PostsController;
