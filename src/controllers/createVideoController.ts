import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../types/video-types'

export const createVideoController = (req: Request, res: Response) => {
    res
    .status(200)
    .json({message: 'create new video'})
}