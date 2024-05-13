import { Request, Response } from 'express'
import { injectable } from 'inversify';

import { SearchQueryParametersType } from '../types/query-types';
import { UserView } from '../types/users-types';
import { StatusCodes } from '../settings';
import { Paginator } from '../types/result-types';
import { UsersQueryRepository } from '../repositories/users-query-repository';
import { UsersService } from '../services/users-service';

@injectable()
export class UsersController {
    constructor(
        protected usersService: UsersService,
        protected usersQueryRepository: UsersQueryRepository) { }

    async createUserController(req: Request, res: Response<UserView>) {
        const createdUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        const user = this.usersQueryRepository.mapToOutput(createdUser)
        res
            .status(StatusCodes.CREATED_201)
            .json(user)
        return
    }

    async getUsersController(req: Request, res: Response<Paginator<UserView[]>>) {
        const query = req.query as unknown as SearchQueryParametersType
        const users = await this.usersQueryRepository.getAllUsers(query)
        res
            .status(StatusCodes.OK_200)
            .json(users)
    }

    async deleteUserController(req: Request, res: Response<boolean>) {
        const userIsDeleted = await this.usersService.deleteUserById(req.params.id)
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