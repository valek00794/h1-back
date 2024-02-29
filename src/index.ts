import { SETTINGS } from './settings'
import express from 'express'

import { getVideosController } from './controllers/getVideosController'
import { findVideoController } from './controllers/findVideoController'
import { createVideoController } from './controllers/createVideoController'
import { deleteVideoController } from './controllers/deleteVideoController'
import { updateVideoController } from './controllers/updateVideoController'
import { clearDbController } from './controllers/clearDbController'

 
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

