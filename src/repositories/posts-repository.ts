import { PostDbType, Post } from '../types/posts-types'
import { PostsModel } from '../db/mongo/posts.model'
import { LikesStatusModel } from '../db/mongo/commentLikesStatus-model'
import { LikeStatusParrent } from '../types/likes-types'

export class PostsRepository {
    async createPost(newPost: Post): Promise<PostDbType> {
        const post = new PostsModel(newPost)
        const postLikesInfo = new LikesStatusModel({
            parrentId: post._id,
            parrentName: LikeStatusParrent.Post,
            likesUsersIds: [],
            dislikesUsersIds: []
        })
        await post.save()
        await postLikesInfo.save()
        return post
    }

    async updatePost(updatedPost: Post, id: string): Promise<boolean> {
        const updatedResult = await PostsModel.findByIdAndUpdate(id, updatedPost, { new: true })
        return updatedResult ? true : false
    }

    async deletePost(id: string): Promise<boolean> {
        const deleteResult = await PostsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    }

    async findPost(id: string): Promise<PostDbType | null> {
        return await PostsModel.findById(id)
    }
}