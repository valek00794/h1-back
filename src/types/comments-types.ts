import { ObjectId, WithId } from 'mongodb'

import { CommentatorInfoType } from './users-types'
import { LikesInfoViewType } from './likes-types'

export type CommentType = {
  content: string
  commentatorInfo: CommentatorInfoType
  createdAt: string
  postId?: ObjectId
  likesInfo?: LikesInfoViewType
}

export type CommentDbType = WithId<CommentType>

export type CommentInputType = {
  content: string;
}

export type CommentViewType = CommentType & {
  id: ObjectId;
}

export type PaginatorCommentsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewType[];
}

