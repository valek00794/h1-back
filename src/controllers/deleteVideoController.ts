import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../types/video-types'

export const deleteVideoController = (req: Request, res: Response) => {
    res
    .status(200)
    .json({message: 'delete video by id'})
}