import { Request, Response } from 'express'
import { setMongoDB } from '../db/db';
import { ResultStatus } from '../types/result-types';

export const clearDbController = async (req: Request, res: Response) => {
    await setMongoDB();
    res
        .status(ResultStatus.NO_CONTENT_204)
        .send()
}