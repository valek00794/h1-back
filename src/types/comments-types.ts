import { ObjectId, WithId } from 'mongodb'

import { CommentatorInfo } from './users-types'
import { LikesInfoView } from './likes-types'

export class Comment {
  constructor(
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
    public postId?: ObjectId,
    public likesInfo?: LikesInfoView
  ) { }
}

export type CommentDbType = WithId<Comment>

export type CommentInputType = {
  content: string
}

export class CommentView {
  constructor(
    public id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
    public likesInfo?: LikesInfoView,
    public postId?: ObjectId,

  ) { }
}