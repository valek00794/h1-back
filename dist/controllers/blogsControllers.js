"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogController = exports.createBlogController = exports.deleteBlogController = exports.findBlogController = exports.getBlogsController = void 0;
const blogs_repository_1 = require("../repositories/blogs-repository");
const getBlogsController = (req, res) => {
    const blogs = blogs_repository_1.blogsRepository.getBlogs();
    res
        .status(200)
        .json(blogs);
};
exports.getBlogsController = getBlogsController;
const findBlogController = (req, res) => {
    const blog = blogs_repository_1.blogsRepository.findBlog(req.params.id);
    if (blog) {
        res
            .status(200)
            .json(blog);
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.findBlogController = findBlogController;
const deleteBlogController = (req, res) => {
    const blogIsDeleted = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (blogIsDeleted) {
        res
            .status(204)
            .send();
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.deleteBlogController = deleteBlogController;
const createBlogController = (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body);
    if (newBlog) {
        res
            .status(201)
            .json(newBlog);
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.createBlogController = createBlogController;
const updateBlogController = (req, res) => {
    const updatedBlog = blogs_repository_1.blogsRepository.updateBlog(req.body, req.params.id);
    if (updatedBlog) {
        res
            .status(204)
            .send();
    }
    else {
        res
            .status(404)
            .send();
    }
};
exports.updateBlogController = updateBlogController;
