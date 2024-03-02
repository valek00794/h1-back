import { SETTINGS } from './settings'
import express from 'express'

import { clearDbController } from './controllers/clearDbController'
import { createBlogController, deleteBlogController, findBlogController, getBlogsController, updateBlogController } from './controllers/blogsControllers'
import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from './controllers/postsControllers'
import { createVideoController, deleteVideoController, findVideoController, getVideosController, updateVideoController } from './controllers/videosControllers'

 
const app = express()
app.use(express.json())
 
app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`)
})

app.get(SETTINGS.PATH.videos, getVideosController)
app.get(SETTINGS.PATH.videosById, findVideoController)
app.post(SETTINGS.PATH.videos, createVideoController)
app.put(SETTINGS.PATH.videosById, updateVideoController)
app.delete(SETTINGS.PATH.videosById, deleteVideoController)

app.get(SETTINGS.PATH.blogs, getBlogsController)
app.get(SETTINGS.PATH.blogsById, findBlogController)
app.post(SETTINGS.PATH.blogs, createBlogController)
app.put(SETTINGS.PATH.blogsById, updateBlogController)
app.delete(SETTINGS.PATH.blogsById, deleteBlogController)

app.get(SETTINGS.PATH.posts, getPostsController)
app.get(SETTINGS.PATH.postsById, findPostController)
app.post(SETTINGS.PATH.posts, createPostController)
app.put(SETTINGS.PATH.postsById, updatePostController)
app.delete(SETTINGS.PATH.postsById, deletePostController)

app.delete(SETTINGS.PATH.clearDb, clearDbController)