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
exports.CommentsRepository = void 0;
const comments_model_1 = require("../db/mongo/comments.model");
const likes_types_1 = require("../types/likes-types");
const commentLikesStatus_model_1 = require("../db/mongo/commentLikesStatus-model");
class CommentsRepository {
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = new comments_model_1.CommentsModel(newComment);
            const commentLikesInfo = new commentLikesStatus_model_1.LikesStatusModel({
                parrentId: comment._id,
                parrentName: likes_types_1.LikeStatusParrent.Comment,
                likesUsersIds: [],
                dislikesUsersIds: []
            });
            yield comment.save();
            yield commentLikesInfo.save();
            return comment;
        });
    }
    updateComment(updatedComment, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield comments_model_1.CommentsModel.findByIdAndUpdate(commentId, updatedComment, { new: true });
            return updatedResult ? true : false;
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield comments_model_1.CommentsModel.findByIdAndDelete(id);
            return deleteResult ? true : false;
        });
    }
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_model_1.CommentsModel.findById(id);
        });
    }
}
exports.CommentsRepository = CommentsRepository;
