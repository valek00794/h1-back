import { DeleteResult, ObjectId, UpdateResult } from 'mongodb'

import { postsCollection } from '../db/db'
import { PostType } from '../types/posts-types'

export const postsRepository = {
    async createPost(newPost: PostType): Promise<PostType> {
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(updatedPost: PostType, id: string): Promise<UpdateResult<PostType>> {
        return await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPost })
    },
    async deletePost(id: string): Promise<DeleteResult> {
        return await postsCollection.deleteOne({ _id: new ObjectId(id) })
    },
}