"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = exports.ResultStatus = exports.SETTINGS = void 0;
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
        devices: '/security/devices',
        comments: '/comments',
        clearDb: '/testing/all-data',
        clearLocalDb: '/testing/videos/all-data',
    },
    ADMIN_AUTH: 'admin:qwerty',
    DB: {
        collection: {
            POSTS: process.env.POST_COLLECTION_NAME || '',
            BLOGS: process.env.BLOG_COLLECTION_NAME || '',
            USERS: process.env.USER_COLLECTION_NAME || '',
            USERS_EMAIL_CONFIRMATIONS: process.env.USER_EMAIL_CONFIRMATIONS_COLLECTION_NAME || '',
            USERS_PASSWORD_RECOVERY: process.env.USERS_PASSWORD_RECOVERY_COLLECTION_NAME || '',
            USERS_DEVICES: process.env.USERS_DEVICES_COLLECTION_NAME || '',
            COMMENTS: process.env.COMMENTS_COLLECTION_NAME || '',
            API_REQUESTS: process.env.API_REQUESTS_COLLECTION_NAME || '',
        },
        mongoURI: process.env.MONGO_URL || 'mongodb://localhost:27017/sprint1localdb'
    },
    JWT: {
        AT_SECRET: process.env.AT_SECRET || '',
        RT_SECRET: process.env.RT_SECRET || '',
        AT_EXPIRES_TIME: process.env.AT_EXPIRES_TIME || '10s',
        RT_EXPIRES_TIME: process.env.RT_EXPIRES_TIME || '20s'
    }
};
var ResultStatus;
(function (ResultStatus) {
    ResultStatus["Success"] = "Success";
    ResultStatus["Created"] = "Created";
    ResultStatus["NoContent"] = "NoContent";
    ResultStatus["BadRequest"] = "BadRequest";
    ResultStatus["Unauthorized"] = "Unauthorized";
    ResultStatus["NotFound"] = "NotFound";
    ResultStatus["Forbidden"] = "Forbidden";
})(ResultStatus || (exports.ResultStatus = ResultStatus = {}));
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["OK_200"] = 200] = "OK_200";
    StatusCodes[StatusCodes["CREATED_201"] = 201] = "CREATED_201";
    StatusCodes[StatusCodes["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    StatusCodes[StatusCodes["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    StatusCodes[StatusCodes["UNAUTHORIZED_401"] = 401] = "UNAUTHORIZED_401";
    StatusCodes[StatusCodes["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
    StatusCodes[StatusCodes["FORBIDDEN_403"] = 403] = "FORBIDDEN_403";
    StatusCodes[StatusCodes["TOO_MANY_REQUESTS_429"] = 429] = "TOO_MANY_REQUESTS_429";
})(StatusCodes || (exports.StatusCodes = StatusCodes = {}));
