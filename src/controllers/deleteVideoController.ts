import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../types/video-types'

export const deleteVideoController = (req: Request, res: Response) => {
    const idVideo = db.videos.findIndex(video => video.id === +req.params.id)
    if( idVideo === -1) {
        res
        .status(404)
        .json({message: 'id not found'})
    } else {
        db.videos.splice(idVideo, 1)
        res
        .status(204)
        .json({message: 'success deleted'})
    }
}