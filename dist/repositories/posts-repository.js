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
exports.postsRepository = void 0;
const posts_model_1 = require("../db/mongo/posts.model");
exports.postsRepository = {
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new posts_model_1.PostsModel(newPost);
            yield post.save();
            return post;
        });
    },
    updatePost(updatedPost, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield posts_model_1.PostsModel.findByIdAndUpdate(id, updatedPost, { new: true });
            return updatedResult ? true : false;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield posts_model_1.PostsModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    },
};
