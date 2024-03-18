import { Request, Response } from 'express'
import { setDB } from '../db/db'

export const clearLocalDbController = (req: Request, res: Response) => {
    setDB();
    res
        .status(204)
        .send()
}