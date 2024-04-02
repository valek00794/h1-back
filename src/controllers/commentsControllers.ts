import { Request, Response } from 'express'

import { CodeResponses } from '../settings';
import { CommentType, PaginatorCommentsViewType } from '../types/comments-types';
import { commentsRepository } from '../repositories/comments-repository';
import { postsRepository } from '../repositories/posts-repository';
import { commentsQueryRepository } from '../repositories/comments-query-repository';


export const findCommentsOfPostController = async (req: Request, res: Response<PaginatorCommentsViewType>) => {
    const post = await postsRepository.findPost(req.params.id)
    if (!post) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const comments = await commentsQueryRepository.getComments(req.query, req.params.blogId)
    res
        .status(CodeResponses.OK_200)
        .json(comments)
}

export const findCommentController = async (req: Request, res: Response<false | CommentType>) => {
    const comment = await commentsQueryRepository.findComment(req.params.id)
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
    const commentatorInfo = {
        userId: req.user?.userId!,
        userLogin: req.user?.userLogin!
    }
    const comment = await commentsQueryRepository.findComment(req.params.commentId)
    if (!comment) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(CodeResponses.FORBIDDEN_403)
            .send()
        return
    }

    await commentsRepository.deleteComment(req.params.id)
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const createCommentForPostController = async (req: Request, res: Response<CommentType>) => {
    if (!req.user || !req.user.userId) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    const post = await postsRepository.findPost(req.params.postId)
    if (!post) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const commentatorInfo = {
        userId: req.user?.userId!,
        userLogin: req.user?.userLogin!
    }
    const comment = await commentsRepository.createComment(req.body, commentatorInfo, req.params.postId)
    res
        .status(CodeResponses.CREATED_201)
        .send(comment)
}

export const updateCommentForPostController = async (req: Request, res: Response<CommentType>) => {
    if (!req.user || !req.user.userId) {
        res
            .status(CodeResponses.UNAUTHORIZED_401)
            .send()
        return
    }
    const comment = await commentsQueryRepository.findComment(req.params.commentId)
    if (!comment) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const commentatorInfo = {
        userId: req.user?.userId!,
        userLogin: req.user?.userLogin!
    }
    if (comment.commentatorInfo.userId !== commentatorInfo.userId &&
        comment.commentatorInfo.userLogin !== commentatorInfo.userLogin) {
        res
            .status(CodeResponses.FORBIDDEN_403)
            .send()
        return
    }
    await commentsRepository.updateComment(req.body, comment)
    res
        .status(CodeResponses.NO_CONTENT_204)
        .send()
}

export const getCommentsForPostController = async (req: Request, res: Response<PaginatorCommentsViewType>) => {
    const post = await postsRepository.findPost(req.params.postId)
    if (!post) {
        res
            .status(CodeResponses.NOT_FOUND_404)
            .send()
        return
    }
    const comments = await commentsQueryRepository.getComments(req.query, req.params.postId)
    res
        .status(CodeResponses.OK_200)
        .send(comments)
}
