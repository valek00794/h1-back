"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        videos: '/videos',
        posts: '/posts',
        blogs: '/blogs',
        clearDb: '/testing/all-data',
        clearLocalDb: '/testing/videos/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty',
    DB: {
        collection: {
            POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
            BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || ''
        },
        mongoURI: process.env.MONGO_URL || 'mongodb://localhost:27017/sprint1localdb'
    }
};
