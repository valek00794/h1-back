import { Request, Response } from 'express'
import { setMongoDB } from '../db/db';

export const clearDbController = (req: Request, res: Response) => {
    setMongoDB();
    res
        .status(204)
        .send()
}