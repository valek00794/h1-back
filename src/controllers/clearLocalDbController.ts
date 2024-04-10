import { Request, Response } from 'express'
import { setDB } from '../db/db'
import { ResultStatus } from '../types/result-types';

export const clearLocalDbController = (req: Request, res: Response) => {
    setDB();
    res
        .status(ResultStatus.NO_CONTENT_204)
        .send()
}