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
exports.LikesRepository = void 0;
const inversify_1 = require("inversify");
const likeStatus_model_1 = require("../db/mongo/likeStatus-model");
let LikesRepository = class LikesRepository {
    updateLikeInfo(parrentId, authorId, authorLogin, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.findOneAndUpdate({ parrentId, authorId, authorLogin }, {
                status,
                addedAt: new Date().toISOString()
            }, { new: true, upsert: true });
        });
    }
    deleteLikeInfo(parrentId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.findOneAndDelete({ parrentId, authorId });
        });
    }
    getLikeInfo(parrentId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield likeStatus_model_1.LikeStatusModel.findOne({ parrentId, authorId });
        });
    }
};
exports.LikesRepository = LikesRepository;
exports.LikesRepository = LikesRepository = __decorate([
    (0, inversify_1.injectable)()
], LikesRepository);
