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
            POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
            BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
            USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
            COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || ''
        },
        mongoURI: process.env.MONGO_URL || 'mongodb://localhost:27017/sprint1localdb'
    }
}

export const CodeResponses = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404
}
