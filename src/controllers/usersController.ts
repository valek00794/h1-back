import { Request, Response } from 'express'

import { PaginatorPostViewType, PostViewType } from '../types/posts-types'
import { postsRepository } from '../repositories/posts-repository';
import { blogsRepository } from '../repositories/blogs-repository';
import { CodeResponses } from '../settings';
import { usersService } from '../services/users-service';
import { usersRepository } from '../repositories/users-repository';

export const createUserController = async (req: Request, res: Response) => {
    const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    res
        .status(CodeResponses.CREATED_201)
        .json(user)
}

export const getUsersController = async (req: Request, res: Response) => {
    const users = await usersRepository.getAllUsers()
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


