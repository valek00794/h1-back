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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const blogs_repository_1 = require("./blogs-repository");
exports.postsRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.find({}).toArray();
        });
    },
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                return db_1.postsCollection.findOne({ "_id": new mongodb_1.ObjectId(id) });
            }
            else {
                return false;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.deleteOne({ "_id": new mongodb_1.ObjectId(id) });
            if (post.deletedCount === 0) {
                return false;
            }
            else {
                return true;
            }
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: new mongodb_1.ObjectId(body.blogId),
                blogName: ''
            };
            const blog = yield blogs_repository_1.blogsRepository.findBlog(body.blogId);
            if (blog) {
                newPost.blogName = blog.name;
            }
            const postInsertId = (yield db_1.postsCollection.insertOne(newPost)).insertedId;
            return yield this.findPost(postInsertId.toString());
        });
    },
    updatePost(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findPost(id);
            if (!post) {
                return false;
            }
            else {
                const updatedPost = {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: new mongodb_1.ObjectId(body.blogId),
                    blogName: ''
                };
                const blog = yield blogs_repository_1.blogsRepository.findBlog(body.blogId);
                if (blog) {
                    updatedPost.blogName = blog.name;
                }
                yield db_1.postsCollection.updateOne({ "_id": new mongodb_1.ObjectId(id) }, { "$set": updatedPost });
                return true;
            }
        });
    }
};
