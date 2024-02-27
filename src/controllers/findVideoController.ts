import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../types/video-types'

export const findVideoController = (req: Request, res: Response<OutputVideoType>) => {
    res
    .status(200)
    .json(db.videos.find(video => video.id === +req.params.id))
}