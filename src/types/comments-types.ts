import { ObjectId, WithId } from 'mongodb'

import { CommentatorInfoType } from './users-types'
import { LikesInfoView } from './likes-types'

export class Comment {
  constructor(
    public content: string,
    public commentatorInfo: CommentatorInfoType,
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
    public commentatorInfo: CommentatorInfoType,
    public createdAt: string,
    public likesInfo?: LikesInfoView,
    public postId?: ObjectId,

  ) { }
}