import { SETTINGS } from './settings'
import express from 'express'

import { getVideosController } from './controllers/getVideosController'
import { findVideoController } from './controllers/findVideoController'
import { createVideoController } from './controllers/createVideoController'
import { deleteVideoController } from './controllers/deleteVideoController'
import { updateVideoController } from './controllers/updateVideoController'
import { clearDbController } from './controllers/clearDbController'
import { deleteBlogController, findBlogController, getBlogsController } from './controllers/blogsController'
import { deletePostController, findPostController, getPostsController } from './controllers/postsController'

 
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