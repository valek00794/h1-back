import { PostType } from '../types/posts-types'
import { PostsModel } from '../db/mongo/post.model'
import { WithId } from 'mongodb'

export const postsRepository = {
    async createPost(newPost: PostType): Promise<WithId<PostType>> {
        return await PostsModel.create(newPost)
    },
    async updatePost(updatedPost: PostType, id: string): Promise<PostType | null> {
        return await PostsModel.findByIdAndUpdate(id, updatedPost, { new: true })
    },
    async deletePost(id: string): Promise<boolean> {
        const deleteResult = await PostsModel.findByIdAndDelete(id)
        return deleteResult ? true : false
    },
}