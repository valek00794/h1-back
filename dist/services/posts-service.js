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
exports.PostsService = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const posts_types_1 = require("../types/posts-types");
const blogs_repository_1 = require("../repositories/blogs-repository");
const posts_repository_1 = require("../repositories/posts-repository");
let PostsService = class PostsService {
    constructor(postsRepository, blogsRepository) {
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
    }
    createPost(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let getBlogId = blogId && mongodb_1.ObjectId.isValid(blogId) ? blogId : body.blogId;
            const newPost = new posts_types_1.Post(body.title, body.shortDescription, body.content, new mongodb_1.ObjectId(getBlogId), '', new Date().toISOString());
            const blog = yield this.blogsRepository.findBlog(getBlogId);
            if (blog) {
                newPost.blogName = blog.name;
            }
            return yield this.postsRepository.createPost(newPost);
        });
    }
    updatePost(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const post = yield this.postsRepository.findPost(id);
            if (!post) {
                return false;
            }
            const updatedPost = new posts_types_1.Post(body.title, body.shortDescription, body.content, new mongodb_1.ObjectId(body.blogId), '', post.createdAt);
            const blog = yield this.blogsRepository.findBlog(body.blogId.toString());
            if (blog) {
                updatedPost.blogName = blog.name;
            }
            return yield this.postsRepository.updatePost(updatedPost, id);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            return yield this.postsRepository.deletePost(id);
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        blogs_repository_1.BlogsRepository])
], PostsService);
