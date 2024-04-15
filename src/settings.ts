import { config } from 'dotenv'
config()

export const SETTINGS = {
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
            POSTS: process.env.POST_COLLECTION_NAME || '',
            BLOGS: process.env.BLOG_COLLECTION_NAME || '',
            USERS: process.env.USER_COLLECTION_NAME || '',
            USERS_EMAIL_CONFIRMATIONS: process.env.USER_EMAIL_CONFIRMATIONS_COLLECTION_NAME || '',
            USERS_REVOKED_TOKENS: process.env.USERS_REVOKED_TOKENS_COLLECTION_NAME || '',
            COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || ''
        },
        mongoURI: process.env.MONGO_URL || 'mongodb://localhost:27017/sprint1localdb'
    },
    JWT: {
        AT_SECRET: process.env.AT_SECRET || '',
        RT_SECRET: process.env.RT_SECRET || '',
        AT_EXPIRES_TIME: process.env.AT_EXPIRES_TIME || '10s',
        RT_EXPIRES_TIME: process.env.RT_EXPIRES_TIME || '20s'
    }
}


export enum ResultStatus {
    Success = 'Success',
    Created = 'Created',
    NoContent = 'NoContent',

    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden'
}

export enum StatusCodes {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    NOT_FOUND_404 = 404,
    FORBIDDEN_403 = 403
}

