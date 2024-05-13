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
exports.BlogsRepository = void 0;
const inversify_1 = require("inversify");
const blogs_model_1 = require("../db/mongo/blogs.model");
let BlogsRepository = class BlogsRepository {
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = new blogs_model_1.BlogsModel(newBlog);
            yield blog.save();
            return blog;
        });
    }
    updateBlog(updatedBlog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield blogs_model_1.BlogsModel.findByIdAndUpdate(id, updatedBlog, { new: true });
            return updatedResult ? true : false;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield blogs_model_1.BlogsModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    }
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_model_1.BlogsModel.findById(id);
        });
    }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsRepository);
