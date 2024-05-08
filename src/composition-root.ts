import { BlogsController } from "./controllers/blogsController";
import { BlogsQueryRepository } from "./repositories/blogs-query-repository";
import { BlogsRepository } from "./repositories/blogs-repository";
import { BlogsService } from "./services/blogs-service";

const blogsRepository = new BlogsRepository()
const blogsQueryRepository = new BlogsQueryRepository()
const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService, blogsQueryRepository)