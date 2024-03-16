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
    getPosts(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let findOptions = {};
            if (blogId) {
                findOptions = { "blogId": new mongodb_1.ObjectId(blogId) };
            }
            const posts = yield db_1.postsCollection.find(findOptions).toArray();
            return posts.map(post => this.mapToOutput(post));
        });
    },
    findPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const post = yield db_1.postsCollection.findOne({ "_id": new mongodb_1.ObjectId(id) });
                if (!post) {
                    return false;
                }
                else {
                    return this.mapToOutput(post);
                }
            }
            else {
                return false;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const post = yield db_1.postsCollection.deleteOne({ "_id": new mongodb_1.ObjectId(id) });
                if (post.deletedCount === 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        });
    },
    createPost(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let getBloggId = (blogId === null || blogId === void 0 ? void 0 : blogId.match(/^[0-9a-fA-F]{24}$/)) ? blogId : body.blogId;
            const newPost = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: new mongodb_1.ObjectId(getBloggId),
                blogName: '',
                createdAt: new Date().toISOString()
            };
            const blog = yield blogs_repository_1.blogsRepository.findBlog(getBloggId);
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
                    blogName: '',
                    createdAt: post.createdAt
                };
                const blog = yield blogs_repository_1.blogsRepository.findBlog(body.blogId.toString());
                if (blog) {
                    updatedPost.blogName = blog.name;
                }
                yield db_1.postsCollection.updateOne({ "_id": new mongodb_1.ObjectId(id) }, { "$set": updatedPost });
                return true;
            }
        });
    },
    mapToOutput(post) {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        };
    }
};
