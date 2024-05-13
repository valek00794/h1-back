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
exports.LikesQueryRepository = void 0;
const inversify_1 = require("inversify");
const likeStatus_model_1 = require("../db/mongo/likeStatus-model");
const likes_types_1 = require("../types/likes-types");
let LikesQueryRepository = class LikesQueryRepository {
    getLikesInfo(parrentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.find({ parrentId });
        });
    }
    mapLikesInfo(likesInfo, userId) {
        var _a;
        const likesInfoView = new likes_types_1.LikesInfoView(likesInfo.filter(like => like.status === likes_types_1.LikeStatus.Like).length, likesInfo.filter(like => like.status === likes_types_1.LikeStatus.Dislike).length, ((_a = likesInfo.find(like => like.authorId.toHexString() === userId)) === null || _a === void 0 ? void 0 : _a.status) || likes_types_1.LikeStatus.None);
        return likesInfoView;
    }
    mapExtendedLikesInfo(likesInfo, userId) {
        const newestLikes = likesInfo.filter(like => like.status === likes_types_1.LikeStatus.Like)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .slice(0, 3);
        const mappedLikesInfo = this.mapLikesInfo(likesInfo, userId);
        const newestLikesView = newestLikes.map(like => new likes_types_1.NewestLike(like.addedAt, like.authorId.toString(), like.authorLogin));
        return new likes_types_1.ExtendedLikesInfo(mappedLikesInfo.likesCount, mappedLikesInfo.dislikesCount, mappedLikesInfo.myStatus, newestLikesView);
    }
};
exports.LikesQueryRepository = LikesQueryRepository;
exports.LikesQueryRepository = LikesQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], LikesQueryRepository);
