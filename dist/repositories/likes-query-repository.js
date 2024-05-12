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
exports.LikesQueryRepository = void 0;
const commentLikesStatus_model_1 = require("../db/mongo/commentLikesStatus-model");
const likes_types_1 = require("../types/likes-types");
class LikesQueryRepository {
    getLikesInfo(parrentId, parrentName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commentLikesStatus_model_1.LikesStatusModel.findOne({ parrentId, parrentName });
        });
    }
    mapLikesInfo(userId, likesInfo) {
        let myLikeStatus = likes_types_1.LikeStatus.None;
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Like;
        }
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Dislike;
        }
        const likesCount = (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.length) || 0;
        const dislikesCount = (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.length) || 0;
        return new likes_types_1.LikesInfoView(likesCount, dislikesCount, myLikeStatus);
    }
    mapExtendedLikesInfo(userId, likesInfo) {
        let myLikeStatus = likes_types_1.LikeStatus.None;
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Like;
        }
        if (userId && (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.includes(userId))) {
            myLikeStatus = likes_types_1.LikeStatus.Dislike;
        }
        const likesCount = (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.likesUsersIds.length) || 0;
        const dislikesCount = (likesInfo === null || likesInfo === void 0 ? void 0 : likesInfo.dislikesUsersIds.length) || 0;
        return new likes_types_1.LikesInfoView(likesCount, dislikesCount, myLikeStatus);
    }
}
exports.LikesQueryRepository = LikesQueryRepository;
