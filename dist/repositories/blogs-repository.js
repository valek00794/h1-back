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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const posts_repository_1 = require("./posts-repository");
exports.blogsRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogsCollection.find({}).toArray();
            return blogs.map(blog => this.mapToOutput(blog));
        });
    },
    findBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const blog = yield db_1.blogsCollection.findOne({ "_id": new mongodb_1.ObjectId(id) });
                if (blog === null) {
                    return false;
                }
                else {
                    return this.mapToOutput(blog);
                }
            }
            else {
                return false;
            }
        });
    },
    findPostsOfBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const posts = yield db_1.postsCollection.find({ "blogId": new mongodb_1.ObjectId(id) }).toArray();
                return posts.map(post => posts_repository_1.postsRepository.mapToOutput(post));
            }
            else {
                return false;
            }
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                const blog = yield db_1.blogsCollection.deleteOne({ "_id": new mongodb_1.ObjectId(id) });
                if (blog.deletedCount === 0) {
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
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const blogInsertId = (yield db_1.blogsCollection.insertOne(newBlog)).insertedId;
            return yield this.findBlog(blogInsertId.toString());
        });
    },
    updateBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.findBlog(id);
            if (!blog) {
                return false;
            }
            else {
                const updatedblog = {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: false,
                };
                yield db_1.blogsCollection.updateOne({ "_id": new mongodb_1.ObjectId(id) }, { "$set": updatedblog });
                return true;
            }
        });
    },
    mapToOutput(blog) {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
};
