import { ObjectId } from 'mongodb';

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentType = {
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

export type CommentDbType = CommentType & {
  _id: ObjectId;
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

