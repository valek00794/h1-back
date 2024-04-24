import { WithId } from 'mongodb'

import { PostType } from '../types/posts-types'
import { PostsModel } from '../db/mongo/posts.model'

export const postsRepository = {
    async createPost(newPost: PostType): Promise<WithId<PostType>> {
        const post = new PostsModel(newPost)
        await post.save()
        return post
    },
    async updatePost(updatedPost: PostType, id: string): Promise<boolean> {
        const updatedResult = await PostsModel.findByIdAndUpdate(id, updatedPost, { new: true })
        return updatedResult ? true : false
    },
    async deletePost(id: string): Promise<boolean> {
        const deleteResult = await PostsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
}