import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { usersService } from '../services/users-service';

export const checkAuthController = async (req: Request, res: Response) => {
    const isAuth = await usersService.checkCredential(req.body.loginOrEmail, req.body.password)
    if (!isAuth) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}