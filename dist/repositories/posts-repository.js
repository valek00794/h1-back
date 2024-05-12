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
exports.PostsRepository = void 0;
const posts_model_1 = require("../db/mongo/posts.model");
const commentLikesStatus_model_1 = require("../db/mongo/commentLikesStatus-model");
const likes_types_1 = require("../types/likes-types");
class PostsRepository {
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new posts_model_1.PostsModel(newPost);
            const postLikesInfo = new commentLikesStatus_model_1.LikesStatusModel({
                parrentId: post._id,
                parrentName: likes_types_1.LikeStatusParrent.Post,
                likesUsersIds: [],
                dislikesUsersIds: []
            });
            yield post.save();
            yield postLikesInfo.save();
            return post;
        });
    }
    updatePost(updatedPost, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield posts_model_1.PostsModel.findByIdAndUpdate(id, updatedPost, { new: true });
            return updatedResult ? true : false;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield posts_model_1.PostsModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    }
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_model_1.PostsModel.findById(id);
        });
    }
}
exports.PostsRepository = PostsRepository;
