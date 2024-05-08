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
exports.BlogsService = void 0;
const mongodb_1 = require("mongodb");
const blogs_types_1 = require("../types/blogs-types");
class BlogsService {
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
}
exports.BlogsService = BlogsService;
