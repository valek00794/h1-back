import { OutputBlogtType } from "./blog"
import { OutputPostType } from "./post"
import { OutputVideoType } from "./video"

export type DBType = {
    posts: OutputPostType[],
    blogs: OutputBlogtType[],
    videos: OutputVideoType[],
}
