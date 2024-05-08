import { Request, Response } from 'express'

import { usersService } from '../services/users-service';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { SearchQueryParametersType } from '../types/query-types';
import { UserViewType } from '../types/users-types';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';

class UsersController {
    async createUserController(req: Request, res: Response<UserViewType>) {
        const createdUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        const user = usersQueryRepository.mapToOutput(createdUser)
        res
            .status(StatusCodes.CREATED_201)
            .json(user)
        return
    }

    async getUsersController(req: Request, res: Response<Paginator<UserViewType[]>>) {
        const query = req.query as unknown as SearchQueryParametersType
        const users = await usersQueryRepository.getAllUsers(query)
        res
            .status(StatusCodes.OK_200)
            .json(users)
    }

    async deleteUserController(req: Request, res: Response<boolean>) {
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
}
export const usersController = new UsersController()