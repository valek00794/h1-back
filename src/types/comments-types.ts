import { ObjectId } from 'mongodb';
import { UserInfo } from './users-types';

export type CommentType = {
  content: string;
  commentatorInfo: UserInfo;
  createdAt: string;
  postId?: ObjectId
};

export type CommentInputType = {
  content: string;
};

export type CommentDbType = CommentType & {
  _id?: ObjectId;
};

export type CommentViewType = CommentType & {
  id: ObjectId;
};

export type PaginatorCommentsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewType[];
};

