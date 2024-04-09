"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeResponses = exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        videos: '/videos',
        posts: '/posts',
        blogs: '/blogs',
        users: '/users',
        auth: '/auth',
        comments: '/comments',
        clearDb: '/testing/all-data',
        clearLocalDb: '/testing/videos/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty',
    DB: {
        collection: {
            POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
            BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
            USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
            USER_EMAIL_CONFIRMATIONS_COLLECTION_NAME: process.env.USER_EMAIL_CONFIRMATIONS_COLLECTION_NAME || '',
            COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || ''
        },
        mongoURI: process.env.MONGO_URL || 'mongodb://localhost:27017/sprint1localdb'
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || '',
        EXPIRES_TIME: process.env.JWT_EXPIRES_TIME || '12h'
    }
};
exports.CodeResponses = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404,
    FORBIDDEN_403: 403
};
