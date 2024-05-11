"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostView = exports.Post = void 0;
class Post {
    constructor(title, shortDescription, content, blogId, blogName, createdAt) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
}
exports.Post = Post;
class PostView extends Post {
    constructor(post, id) {
        super(post.title, post.shortDescription, post.content, post.blogId, post.blogName, post.createdAt);
        this.id = id;
    }
}
exports.PostView = PostView;
