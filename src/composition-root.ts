import { AuthController } from "./controllers/authController"
import { BlogsController } from "./controllers/blogsController"
import { CommentsController } from "./controllers/commentsController"
import { PostsController } from "./controllers/postsController"
import { UsersController } from "./controllers/usersController"
import { UsersDevicesController } from "./controllers/usersDevicesController"
import { BlogsQueryRepository } from "./repositories/blogs-query-repository"
import { BlogsRepository } from "./repositories/blogs-repository"
import { CommentsQueryRepository } from "./repositories/comments-query-repository"
import { CommentsRepository } from "./repositories/comments-repository"
import { LikesQueryRepository } from "./repositories/likes-query-repository"
import { LikesRepository } from "./repositories/likes-repository"
import { PostsQueryRepository } from "./repositories/posts-query-repository"
import { PostsRepository } from "./repositories/posts-repository"
import { UsersQueryRepository } from "./repositories/users-query-repository"
import { UsersRepository } from "./repositories/users-repository"
import { UsersDevicesQueryRepository } from "./repositories/usersDevices-query-repository"
import { UsersDevicesRepository } from "./repositories/usersDevices-repository"
import { AuthService } from "./services/auth-service"
import { BlogsService } from "./services/blogs-service"
import { CommentsService } from "./services/comments-service"
import { LikesService } from "./services/likes-service"
import { PostsService } from "./services/posts-service"
import { UsersService } from "./services/users-service"
import { UsersDevicesService } from "./services/usersDevices-service"

const likesQueryRepository = new LikesQueryRepository()
const likesRepository = new LikesRepository()

const likesService = new LikesService(likesRepository)

const blogsRepository = new BlogsRepository()
export const blogsQueryRepository = new BlogsQueryRepository()
const blogsService = new BlogsService(blogsRepository)

const postsQueryRepository = new PostsQueryRepository(likesQueryRepository)
const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository, blogsRepository)

const commentsQueryRepository = new CommentsQueryRepository(likesQueryRepository)
const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository, postsRepository)

export const usersQueryRepository = new UsersQueryRepository()
export const usersRepository = new UsersRepository()
const usersService = new UsersService(usersRepository)

const usersDevicesQueryRepository = new UsersDevicesQueryRepository()
const usersDevicesRepository = new UsersDevicesRepository()
const authService = new AuthService(usersRepository, usersDevicesRepository)
const usersDevicesService = new UsersDevicesService(authService, usersDevicesRepository)


export const blogsController = new BlogsController(blogsService, blogsQueryRepository)
export const commentsController = new CommentsController(commentsService, likesService, commentsQueryRepository, postsQueryRepository)
export const postsController = new PostsController(postsService, likesService, postsQueryRepository, blogsQueryRepository)
export const usersController = new UsersController(usersService, usersQueryRepository)
export const authController = new AuthController(authService, usersService, usersDevicesService, usersQueryRepository)
export const usersDevicesController = new UsersDevicesController(authService, usersDevicesService, usersDevicesQueryRepository)