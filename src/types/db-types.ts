import { OutputBlogType } from "./blogs-types"
import { OutputPostType } from "./posts-types"
import { OutputVideoType } from "./videos-types"

export type DBType = {
    posts: OutputPostType[],
    blogs: OutputBlogType[],
    videos: OutputVideoType[],
}
