import { BlogsController } from "./controllers/blogsController";
import { CommentsController } from "./controllers/commentsController";
import { PostsController } from "./controllers/postsController";
import { BlogsQueryRepository } from "./repositories/blogs-query-repository";
import { BlogsRepository } from "./repositories/blogs-repository";
import { CommentsQueryRepository } from "./repositories/comments-query-repository";
import { CommentsRepository } from "./repositories/comments-repository";
import { PostsQueryRepository } from "./repositories/posts-query-repository";
import { PostsRepository } from "./repositories/posts-repository";
import { BlogsService } from "./services/blogs-service";
import { CommentsService } from "./services/comments-service";
import { PostsService } from "./services/posts-service";

const blogsRepository = new BlogsRepository()
const blogsQueryRepository = new BlogsQueryRepository()
const blogsService = new BlogsService(blogsRepository)

const postsQueryRepository = new PostsQueryRepository()
const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository, blogsRepository)

const commentsQueryRepository = new CommentsQueryRepository()
const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)

export const blogsController = new BlogsController(blogsService, blogsQueryRepository)
export const commentsController = new CommentsController(commentsService, commentsQueryRepository, postsQueryRepository)
export const postsController = new PostsController(postsService, postsQueryRepository, blogsQueryRepository)