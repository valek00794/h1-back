import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../types/video'

export const getVideosController = (req: Request, res: Response<OutputVideoType[]>) => {
    res
    .status(200)
    .json(db.videos)
}