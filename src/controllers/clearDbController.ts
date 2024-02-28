import { Request, Response } from 'express'
import { setDB } from '../db/db'

export const clearDbController = (req: Request, res: Response) => {
    setDB();
    res
        .status(204)
        .send()
}