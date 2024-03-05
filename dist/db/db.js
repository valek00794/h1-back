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
exports.setDB = exports.db = exports.runDb = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URL;
if (!mongoURI) {
    throw new Error('MongoDB Url not found');
}
const client = new mongodb_1.MongoClient(mongoURI);
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
exports.db = {
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
    posts: [
        {
            "id": "1",
            "title": "string1",
            "shortDescription": "string1",
            "content": "string1",
            "blogId": "1",
            "blogName": "string1"
        },
        {
            "id": "2",
            "title": "string2",
            "shortDescription": "string2",
            "content": "string2",
            "blogId": "2",
            "blogName": "string2"
        }
    ],
    blogs: [
        {
            "id": "1",
            "name": "blog1",
            "description": "descriptionBlog1",
            "websiteUrl": "https://Id2Nij8.9.ge8Mr7.PRsadsdoD4a7HCL3UkRvN.yYJ_8zwBm72uzzor_MLVW2fsfRZ/5jcX85qxWhdGDh9cg1M-4lcYA"
        },
        {
            "id": "2",
            "name": "blog2",
            "description": "descriptionBlog2",
            "websiteUrl": "https://Id2Nij8.9.ge8Mr7.PRsadsdoD4a7HCL3UkRvN.yYJ_8zwBm72uzzor_MLVW2fsfRZ/5jcX85qxWhdGDh9cg1M-4lcYA"
        }
    ]
};
const setDB = (dataset) => {
    if (!dataset) {
        exports.db.videos = [];
        exports.db.posts = [];
        exports.db.blogs = [];
        return;
    }
    exports.db.videos = dataset.videos || exports.db.videos;
    exports.db.posts = dataset.posts || exports.db.posts;
    exports.db.blogs = dataset.blogs || exports.db.blogs;
};
exports.setDB = setDB;
