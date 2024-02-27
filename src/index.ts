import { SETTINGS } from './settings'
import { getVideosController } from './controllers/getVideosController'
import { findVideoController } from './controllers/findVideoController'
import { createVideoController } from './controllers/createVideoController'
import { deleteVideoController } from './controllers/deleteVideoController'
import { updateVideoController } from './controllers/updateVideoController'
import express from 'express'
 
const app = express()
app.use(express.json())
 
app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`)
})

app.get('/', getVideosController)
app.get('/:id', findVideoController)
app.post('/', createVideoController)
app.delete('/:id', deleteVideoController)
app.put('/:id', updateVideoController)

