"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogView = exports.Blog = void 0;
class Blog {
    constructor(name, description, websiteUrl, createdAt, isMembership) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
}
exports.Blog = Blog;
class BlogView {
    constructor(id, name, description, websiteUrl, createdAt, isMembership) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
}
exports.BlogView = BlogView;
