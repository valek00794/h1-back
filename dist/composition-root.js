"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDevicesController = exports.authController = exports.usersController = exports.postsController = exports.commentsController = exports.blogsController = exports.usersRepository = exports.usersQueryRepository = exports.blogsQueryRepository = void 0;
const authController_1 = require("./controllers/authController");
const blogsController_1 = require("./controllers/blogsController");
const commentsController_1 = require("./controllers/commentsController");
const postsController_1 = require("./controllers/postsController");
const usersController_1 = require("./controllers/usersController");
const usersDevicesController_1 = require("./controllers/usersDevicesController");
const blogs_query_repository_1 = require("./repositories/blogs-query-repository");
const blogs_repository_1 = require("./repositories/blogs-repository");
const comments_query_repository_1 = require("./repositories/comments-query-repository");
const comments_repository_1 = require("./repositories/comments-repository");
const posts_query_repository_1 = require("./repositories/posts-query-repository");
const posts_repository_1 = require("./repositories/posts-repository");
const users_query_repository_1 = require("./repositories/users-query-repository");
const users_repository_1 = require("./repositories/users-repository");
const usersDevices_query_repository_1 = require("./repositories/usersDevices-query-repository");
const usersDevices_repository_1 = require("./repositories/usersDevices-repository");
const auth_service_1 = require("./services/auth-service");
const blogs_service_1 = require("./services/blogs-service");
const comments_service_1 = require("./services/comments-service");
const posts_service_1 = require("./services/posts-service");
const users_service_1 = require("./services/users-service");
const usersDevices_service_1 = require("./services/usersDevices-service");
const blogsRepository = new blogs_repository_1.BlogsRepository();
exports.blogsQueryRepository = new blogs_query_repository_1.BlogsQueryRepository();
const blogsService = new blogs_service_1.BlogsService(blogsRepository);
const postsQueryRepository = new posts_query_repository_1.PostsQueryRepository();
const postsRepository = new posts_repository_1.PostsRepository();
const postsService = new posts_service_1.PostsService(postsRepository, blogsRepository);
const commentsQueryRepository = new comments_query_repository_1.CommentsQueryRepository();
const commentsRepository = new comments_repository_1.CommentsRepository();
const commentsService = new comments_service_1.CommentsService(commentsRepository);
exports.usersQueryRepository = new users_query_repository_1.UsersQueryRepository();
exports.usersRepository = new users_repository_1.UsersRepository();
const usersService = new users_service_1.UsersService(exports.usersRepository);
const usersDevicesQueryRepository = new usersDevices_query_repository_1.UsersDevicesQueryRepository();
const usersDevicesRepository = new usersDevices_repository_1.UsersDevicesRepository();
const authService = new auth_service_1.AuthService(usersService, exports.usersRepository, usersDevicesRepository);
const usersDevicesService = new usersDevices_service_1.UsersDevicesService(authService, usersDevicesRepository);
exports.blogsController = new blogsController_1.BlogsController(blogsService, exports.blogsQueryRepository);
exports.commentsController = new commentsController_1.CommentsController(commentsService, commentsQueryRepository, postsQueryRepository);
exports.postsController = new postsController_1.PostsController(postsService, postsQueryRepository, exports.blogsQueryRepository);
exports.usersController = new usersController_1.UsersController(usersService, exports.usersQueryRepository);
exports.authController = new authController_1.AuthController(authService, usersService, usersDevicesService, exports.usersQueryRepository);
exports.usersDevicesController = new usersDevicesController_1.UsersDevicesController(authService, usersDevicesService, usersDevicesQueryRepository);
