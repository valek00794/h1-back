"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentView = exports.Comment = void 0;
class Comment {
    constructor(content, commentatorInfo, createdAt, postId, likesInfo) {
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesInfo = likesInfo;
    }
}
exports.Comment = Comment;
class CommentView {
    constructor(id, content, commentatorInfo, createdAt, likesInfo, postId) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
        this.postId = postId;
    }
}
exports.CommentView = CommentView;
