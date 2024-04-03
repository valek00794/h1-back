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
exports.blogsRepository = {
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    updateBlog(updatedblog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedblog });
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
};
