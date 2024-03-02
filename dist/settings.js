"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        videos: '/videos',
        videosById: '/videos/:id',
        clearDb: '/testing/all-data',
        posts: '/posts',
        blogs: '/blogs',
        postsById: '/posts/:id',
        blogsById: '/blogs/:id',
    }
};
