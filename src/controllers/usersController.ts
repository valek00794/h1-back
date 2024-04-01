import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { usersService } from '../services/users-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { usersRepository } from '../repositories/users-repository';
import { SearchQueryParametersType } from '../types/query-types';

export const createUserController = async (req: Request, res: Response) => {
    const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    res
        .status(CodeResponses.CREATED_201)
        .json(user)
}

export const getUsersController = async (req: Request, res: Response) => {
    const queryParameters: SearchQueryParametersType = {
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
        searchLoginTerm: req.query.searchLoginTerm as string | null,
        searchEmailTerm: req.query.searchEmailTerm as string | null,
      };
    const users = await usersQueryRepository.getAllUsers(queryParameters)
    res
        .status(CodeResponses.OK_200)
        .json(users)
}

export const deleteUserController = async (req: Request, res: Response) => {
    const userIsDeleted = await usersRepository.deleteUserById(req.params.id)
    if (!userIsDeleted) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}


