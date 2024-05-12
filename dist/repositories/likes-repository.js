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
exports.LikesRepository = void 0;
const commentLikesStatus_model_1 = require("../db/mongo/commentLikesStatus-model");
class LikesRepository {
    createLikeInfo(parrentId, parrentName) {
        return __awaiter(this, void 0, void 0, function* () {
            const likesInfo = new commentLikesStatus_model_1.LikesStatusModel({
                parrentId,
                parrentName,
                likesUsersIds: [],
                dislikesUsersIds: []
            });
            yield likesInfo.save();
            return likesInfo;
        });
    }
    likeEntity(entityId, userId, parrentName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeEntityLikeStatus(entityId, userId, parrentName);
            return yield commentLikesStatus_model_1.LikesStatusModel.findOneAndUpdate({ parrentId: entityId, parrentName }, { $addToSet: { likesUsersIds: userId } }, { new: true });
        });
    }
    dislikeEntity(entityId, userId, parrentName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeEntityLikeStatus(entityId, userId, parrentName);
            return yield commentLikesStatus_model_1.LikesStatusModel.findOneAndUpdate({ parrentId: entityId, parrentName }, { $addToSet: { dislikesUsersIds: userId } }, { new: true });
        });
    }
    removeEntityLikeStatus(entityId, userId, parrentName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commentLikesStatus_model_1.LikesStatusModel.findOneAndUpdate({ parrentId: entityId, parrentName }, {
                $pull: { likesUsersIds: userId, dislikesUsersIds: userId }
            }, { new: true });
        });
    }
}
exports.LikesRepository = LikesRepository;
