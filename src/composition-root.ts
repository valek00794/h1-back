import { Container } from "inversify"
import "reflect-metadata"

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

export const container = new Container();
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

container.bind(AuthController).to(AuthController);
container.bind(AuthService).to(AuthService);

container.bind(UsersDevicesController).to(UsersDevicesController);
container.bind(UsersDevicesService).to(UsersDevicesService);
container.bind(UsersDevicesRepository).to(UsersDevicesRepository);
container.bind(UsersDevicesQueryRepository).to(UsersDevicesQueryRepository);

container.bind(LikesService).to(LikesService);
container.bind(LikesRepository).to(LikesRepository);
container.bind(LikesQueryRepository).to(LikesQueryRepository);
