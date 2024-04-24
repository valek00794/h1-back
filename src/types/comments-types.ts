import { ObjectId } from 'mongodb'

import { CommentatorInfoType } from './users-types'

export type CommentType = {
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  postId?: ObjectId
}

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

