import { Request, Response } from 'express'
import { setMongoDB } from '../db/db';
import { CodeResponses } from '../settings';

export const clearDbController = (req: Request, res: Response) => {
    setMongoDB();
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}