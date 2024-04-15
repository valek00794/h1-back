import { Request, Response } from 'express'
import { setDB } from '../db/db'
import { StatusCodes } from '../settings';

export const clearLocalDbController = (req: Request, res: Response) => {
    setDB();
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
}