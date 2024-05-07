import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { PaginatorUsersViewType, UserViewType } from '../types/users-types';
import { StatusCodes } from '../settings';

export const createUserController = async (req: Request, res: Response<UserViewType>) => {
    const createdUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    const user = usersQueryRepository.mapToOutput(createdUser)
    res
        .status(StatusCodes.CREATED_201)
        .json(user)
    return
}

export const getUsersController = async (req: Request, res: Response<PaginatorUsersViewType>) => {
    const query = req.query as unknown as SearchQueryParametersType;
    const users = await usersQueryRepository.getAllUsers(query)
    res
        .status(StatusCodes.OK_200)
        .json(users)
}

export const deleteUserController = async (req: Request, res: Response<boolean>) => {
    const userIsDeleted = await usersService.deleteUserById(req.params.id)
    if (!userIsDeleted) {
        res
            .status(StatusCodes.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(StatusCodes.NO_CONTENT_204)
        .send()
}


