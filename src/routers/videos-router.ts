import { Router } from "express";
import { createVideoController, deleteVideoController, findVideoController, getVideosController, updateVideoController } from "../controllers/videosController";


export const videosRouter = Router();

videosRouter.get('/', getVideosController)
videosRouter.get('/:id', findVideoController)
videosRouter.post('/', createVideoController)
videosRouter.put('/:id', updateVideoController)
videosRouter.delete('/:id', deleteVideoController)