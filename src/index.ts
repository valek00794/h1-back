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

app.get('/', getVideosController)
app.get('/:id', findVideoController)
app.post('/', createVideoController)
app.delete('/:id', deleteVideoController)
app.put('/:id', updateVideoController)
app.delete('/testing/all-data', clearDbController)

