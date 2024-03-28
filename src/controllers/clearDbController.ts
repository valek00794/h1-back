import { Request, Response } from 'express'
import { setMongoDB } from '../db/db';
import { CodeResponses } from '../settings';

export const clearDbController = async (req: Request, res: Response) => {
    await setMongoDB();
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}