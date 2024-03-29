import { app } from './app'

import { SETTINGS } from './settings'

import { runDb } from './db/db'

const startApp = async () => {
  await runDb()
  app.listen(SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${SETTINGS.PORT}`)
  })
}

startApp()