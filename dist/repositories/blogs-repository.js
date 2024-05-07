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
exports.blogsRepository = void 0;
const blogs_model_1 = require("../db/mongo/blogs.model");
exports.blogsRepository = {
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = new blogs_model_1.BlogsModel(newBlog);
            yield blog.save();
            return blog;
        });
    },
    updateBlog(updatedBlog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield blogs_model_1.BlogsModel.findByIdAndUpdate(id, updatedBlog, { new: true });
            return updatedResult ? true : false;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield blogs_model_1.BlogsModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_model_1.BlogsModel.findById(id);
        });
    },
};
