import {config} from 'dotenv'
config()
 
export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        videos: '/videos',    
        posts: '/posts',
        blogs: '/blogs',
        clearDb: '/testing/all-data',
    }
}
