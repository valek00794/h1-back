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
const likeStatus_model_1 = require("../db/mongo/likeStatus-model");
class LikesRepository {
    createLikeInfo(parrentId, authorId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const likesInfo = new likeStatus_model_1.LikeStatusModel({
                parrentId,
                authorId,
                status,
                addedAt: new Date().toISOString(),
            });
            yield likesInfo.save();
            return likesInfo;
        });
    }
    updateLikeInfo(parrentId, authorId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.findOneAndUpdate({ parrentId, authorId }, {
                status,
                addedAt: new Date().toISOString()
            }, { new: true });
        });
    }
    getLikeInfo(parrentId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.findOne({ parrentId, authorId });
        });
    }
}
exports.LikesRepository = LikesRepository;
