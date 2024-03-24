import express from 'express'

import { videosRouter } from './routers/videos-router'
import { postsRouter } from './routers/posts-router'
import { blogsRouter } from './routers/blogs-router'
import { clearLocalDbController } from './controllers/clearLocalDbController'
import { clearDbController } from './controllers/clearDbController'
import { SETTINGS } from './settings'


export const app = express()
app.use(express.json())

app.use(SETTINGS.PATH.videos, videosRouter)
app.use(SETTINGS.PATH.posts, postsRouter)
app.use(SETTINGS.PATH.blogs, blogsRouter)

app.delete(SETTINGS.PATH.clearDb, clearDbController)
app.delete(SETTINGS.PATH.clearLocalDb, clearLocalDbController)
