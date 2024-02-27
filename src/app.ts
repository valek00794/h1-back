import express from 'express'
import {SETTINGS} from './settings'
 
export const app = express()
app.use(express.json())
 
app.get(`${SETTINGS['BASE-URL']}/videos`, (req, res) => {
    res.status(200).json({message: 'get all videos'})
})

app.post(`${SETTINGS['BASE-URL']}/videos`, (req, res) => {
    res.status(200).json({message: 'create new video'})
})

app.get(`${SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({message: 'get video by id'})
})

app.put(`${SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({message: 'update video by id'})
})

app.delete(`${SETTINGS['BASE-URL']}/videos/:id`, (req, res) => {
    res.status(200).json({message: 'delete video by id'})
})