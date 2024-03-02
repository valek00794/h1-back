import { SETTINGS } from './settings'
import express from 'express'

import { clearDbController } from './controllers/clearDbController'
import { deleteBlogController, findBlogController, getBlogsController } from './controllers/blogsControllers'
import { deletePostController, findPostController, getPostsController } from './controllers/postsControllers'
import { createVideoController, deleteVideoController, findVideoController, getVideosController, updateVideoController } from './controllers/videosControllers'

 
const app = express()
app.use(express.json())
 
app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`)
})

app.get(SETTINGS.PATH.videos, getVideosController)
app.get(SETTINGS.PATH.videosById, findVideoController)
app.post(SETTINGS.PATH.videos, createVideoController)
app.delete(SETTINGS.PATH.videosById, deleteVideoController)
app.put(SETTINGS.PATH.videosById, updateVideoController)
app.delete(SETTINGS.PATH.videosById, clearDbController)

app.get(SETTINGS.PATH.blogs, getBlogsController)
app.get(SETTINGS.PATH.posts, getPostsController)
app.get(SETTINGS.PATH.postsById, findPostController)
app.get(SETTINGS.PATH.blogsById, findBlogController)
app.delete(SETTINGS.PATH.postsById, deletePostController)
app.delete(SETTINGS.PATH.blogsById, deleteBlogController)