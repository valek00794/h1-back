import { Request, Response } from 'express'
import { setDB } from '../db/db'
import { CodeResponses } from '../settings';

export const clearLocalDbController = (req: Request, res: Response) => {
    setDB();
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}