import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { PaginatorUsersViewType, UserViewType } from '../types/users-types';
import { APIErrorResult, ResultStatus } from '../types/result-types';

export const createUserController = async (req: Request, res: Response<UserViewType | APIErrorResult | null>) => {
    const result = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    if (result.status === ResultStatus.CREATED_201) {
        res
            .status(result.status)
            .json(result.data)
        return
    }
}

export const getUsersController = async (req: Request, res: Response<PaginatorUsersViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const users = await usersQueryRepository.getAllUsers(query)
    res
        .status(ResultStatus.OK_200)
        .json(users)
}

export const deleteUserController = async (req: Request, res: Response<boolean>) => {
    const userIsDeleted = await usersService.deleteUserById(req.params.id)
    if (!userIsDeleted) {
        res
            .status(ResultStatus.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(ResultStatus.NO_CONTENT_204)
        .send()
}


