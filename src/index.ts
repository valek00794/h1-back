import express from 'express';
const app = express()
const envPort = process.env.PORT;
const port = envPort ? +envPort : 5000;

app.get('/', (req, res) => {
  res.send('Hello backender')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})