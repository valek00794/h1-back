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
exports.LikesService = void 0;
const likes_types_1 = require("../types/likes-types");
const settings_1 = require("../settings");
const result_types_1 = require("../types/result-types");
class LikesService {
    constructor(likesRepository) {
        this.likesRepository = likesRepository;
    }
    changeLikeStatus(parrentId, parrentName, likeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (likeStatus === likes_types_1.LikeStatus.Like) {
                yield this.likesRepository.likeEntity(parrentId, userId, parrentName);
            }
            if (likeStatus === likes_types_1.LikeStatus.Dislike) {
                yield this.likesRepository.dislikeEntity(parrentId, userId, parrentName);
            }
            if (likeStatus === likes_types_1.LikeStatus.None) {
                yield this.likesRepository.removeEntityLikeStatus(parrentId, userId, parrentName);
            }
            return new result_types_1.Result(settings_1.ResultStatus.NoContent, null, null);
        });
    }
}
exports.LikesService = LikesService;
