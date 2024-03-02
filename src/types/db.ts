import { BlogViewModel } from "./blog"
import { PostViewModel } from "./post"
import { OutputVideoType } from "./video"

export type DBType = {
    posts: PostViewModel[],
    blogs: BlogViewModel[],
    videos: OutputVideoType[],
}
