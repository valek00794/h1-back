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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMongoDB = exports.setDB = exports.dbLocal = exports.runDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const settings_1 = require("../settings");
const apiRequests_model_1 = require("../db/mongo/apiRequests.model");
const blogs_model_1 = require("../db/mongo/blogs.model");
const comments_model_1 = require("../db/mongo/comments.model");
const posts_model_1 = require("../db/mongo/posts.model");
const users_model_1 = require("../db/mongo/users.model");
const usersDevices_model_1 = require("../db/mongo/usersDevices.model");
const usersEmailConfirmation_model_1 = require("../db/mongo/usersEmailConfirmation.model");
const usersRecoveryPasssword_model_1 = require("../db/mongo/usersRecoveryPasssword.model");
dotenv_1.default.config();
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(settings_1.SETTINGS.DB.mongoURI);
        console.log('Connect success');
    }
    catch (e) {
        console.log('Connect ERROR', e);
        yield mongoose_1.default.disconnect();
    }
});
exports.runDb = runDb;
exports.dbLocal = {
    videos: [
        {
            "id": 1,
            "title": "im play",
            "author": "Barsik",
            "canBeDownloaded": true,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P144"
            ]
        },
        {
            "id": 2,
            "title": "im sleep",
            "author": "Barsik",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P240"
            ]
        },
        {
            "id": 3,
            "title": "im eat",
            "author": "Barsik",
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": "2024-02-27T09:08:13.199Z",
            "publicationDate": "2024-02-27T09:08:13.200Z",
            "availableResolutions": [
                "P360"
            ]
        }
    ],
};
const setDB = (dataset) => {
    if (!dataset) {
        exports.dbLocal.videos = [];
        return;
    }
    exports.dbLocal.videos = dataset.videos || exports.dbLocal.videos;
};
exports.setDB = setDB;
const setMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield apiRequests_model_1.ApiRequestsModel.collection.drop();
    yield blogs_model_1.BlogsModel.collection.drop();
    yield comments_model_1.CommentsModel.collection.drop();
    yield posts_model_1.PostsModel.collection.drop();
    yield users_model_1.UsersModel.collection.drop();
    yield usersDevices_model_1.UsersDevicesModel.collection.drop();
    yield usersEmailConfirmation_model_1.UsersEmailConfirmationsModel.collection.drop();
    yield usersRecoveryPasssword_model_1.UsersRecoveryPassswordModel.collection.drop();
});
exports.setMongoDB = setMongoDB;
