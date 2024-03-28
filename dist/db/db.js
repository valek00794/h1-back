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
exports.setMongoDB = exports.setDB = exports.usersCollection = exports.blogsCollection = exports.postsCollection = exports.dbLocal = exports.runDb = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const settings_1 = require("../settings");
dotenv_1.default.config();
const client = new mongodb_1.MongoClient(settings_1.SETTINGS.DB.mongoURI);
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Connect success');
    }
    catch (e) {
        console.log('Connect ERROR', e);
        yield client.close();
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
const db = client.db();
exports.postsCollection = db.collection(settings_1.SETTINGS.DB.collection.POST_COLLECTION_NAME);
exports.blogsCollection = db.collection(settings_1.SETTINGS.DB.collection.BLOG_COLLECTION_NAME);
exports.usersCollection = db.collection(settings_1.SETTINGS.DB.collection.USER_COLLECTION_NAME);
const setDB = (dataset) => {
    if (!dataset) {
        exports.dbLocal.videos = [];
        return;
    }
    exports.dbLocal.videos = dataset.videos || exports.dbLocal.videos;
};
exports.setDB = setDB;
const setMongoDB = () => {
    exports.postsCollection.drop();
    exports.blogsCollection.drop();
    exports.usersCollection.drop();
};
exports.setMongoDB = setMongoDB;
