import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { CommentType, CommentatorInfo, PaginatorCommentsViewType } from '../types/comments-types';
import { commentsRepository } from '../repositories/comments-repository';
import { postsRepository } from '../repositories/posts-repository';


export const findCommentsOfPostController = async (req: Request, res: Response<PaginatorCommentsViewType>) => {
    const post = await postsRepository.findPost(req.params.id)
    if (!post) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const posts = await commentsRepository.getComments(req.query, req.params.blogId)
    res
        .status(CodeResponses.OK_200)
        .json(posts)
}

export const findCommentController = async (req: Request, res: Response<false | CommentType>) => {
    const comment = await commentsRepository.findComment(req.params.id)
    if (!comment) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.OK_200)
        .json(comment)
}

export const deleteCommentController = async (req: Request, res: Response) => {
    const commentIsDeleted = await commentsRepository.deleteComment(req.params.id)
    if (!commentIsDeleted) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const createCommentForPostController = async (req: Request, res: Response) => {
    const post = await postsRepository.findPost(req.params.postId)
    if (!post) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const comment = await commentsRepository.createComment(req.body, req.commentatorInfo! as CommentatorInfo, req.params.postId)


    if (!comment) {
        res
            .status(CodeResponses.BAD_REQUEST_400)
            .send()
        return
    }
}
