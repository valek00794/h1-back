import { Request, Response } from 'express'
import { setMongoDB } from '../db/db';
import { StatusCodes } from '../settings';

export const clearDbController = async (req: Request, res: Response) => {
    await setMongoDB();
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
}