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
const likeStatus_model_1 = require("../db/mongo/likeStatus-model");
const likes_types_1 = require("../types/likes-types");
class LikesQueryRepository {
    getLikesInfo(parrentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.find({ parrentId });
        });
    }
    getNewestLikes(parrentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const VIEW_LIKES_COUNT = 3;
            const newestLike = yield likeStatus_model_1.LikeStatusModel
                .find({ parrentId, status: likes_types_1.LikeStatus.Like })
                .sort({ addedAt: -1 })
                .limit(VIEW_LIKES_COUNT);
            return this.mapNewestLikes(newestLike);
        });
    }
    mapLikesInfo(likesInfo, userId) {
        var _a;
        const likesInfoView = new likes_types_1.LikesInfoView(likesInfo.filter(like => like.status === likes_types_1.LikeStatus.Like).length, likesInfo.filter(like => like.status === likes_types_1.LikeStatus.Dislike).length, ((_a = likesInfo.find(like => like.authorId.toHexString() === userId)) === null || _a === void 0 ? void 0 : _a.status) || likes_types_1.LikeStatus.None);
        return likesInfoView;
    }
    mapExtendedLikesInfo(likesInfo, newestLikes) {
        return new likes_types_1.ExtendedLikesInfo(likesInfo.likesCount, likesInfo.dislikesCount, likesInfo.myStatus, newestLikes);
    }
    mapNewestLikes(likesInfo) {
        return likesInfo.map(like => new likes_types_1.NewestLike(like.addedAt, like.authorId.toString(), like.authorLogin));
    }
}
exports.LikesQueryRepository = LikesQueryRepository;
