import {config} from 'dotenv'
config()
 
export const SETTINGS = {
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
}
