import {app} from './app'
import {SETTINGS} from './settings'

app.listen(SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${SETTINGS.PORT}`)
})