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
exports.BlogsService = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const blogs_types_1 = require("../types/blogs-types");
const blogs_repository_1 = require("../repositories/blogs-repository");
let BlogsService = class BlogsService {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = new blogs_types_1.Blog(body.name, body.description, body.websiteUrl, new Date().toISOString(), false);
            return yield this.blogsRepository.createBlog(newBlog);
        });
    }
    updateBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            const blog = yield this.blogsRepository.findBlog(id);
            if (!blog) {
                return false;
            }
            const updatedblog = new blogs_types_1.Blog(body.name, body.description, body.websiteUrl, blog.createdAt, false);
            return yield this.blogsRepository.updateBlog(updatedblog, id);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return false;
            }
            return yield this.blogsRepository.deleteBlog(id);
        });
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], BlogsService);
