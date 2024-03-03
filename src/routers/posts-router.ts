import { Router } from "express";

import { createPostController, deletePostController, findPostController, getPostsController, updatePostController } from '../controllers/postsControllers'

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.post('/', createPostController)
postsRouter.put('/:id', updatePostController)
postsRouter.delete('/:id', deletePostController)