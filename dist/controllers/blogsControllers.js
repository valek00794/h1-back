"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogController = exports.createBlogController = exports.deleteBlogController = exports.findBlogController = exports.getBlogsController = void 0;
const db_1 = require("../db/db");
const validationErrorsMassages = {
    id: 'Not found blog with the requested ID',
};
let apiErrors = [];
const getBlogsController = (req, res) => {
    res
        .status(200)
        .json(db_1.db.blogs);
};
exports.getBlogsController = getBlogsController;
const findBlogController = (req, res) => {
    apiErrors = [];
    const blogId = db_1.db.posts.findIndex(blog => blog.id === req.params.id);
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        res
            .status(200)
            .json(db_1.db.blogs[blogId]);
    }
};
exports.findBlogController = findBlogController;
const deleteBlogController = (req, res) => {
    apiErrors = [];
    const blogId = db_1.db.blogs.findIndex(blog => blog.id === req.params.id);
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        db_1.db.blogs.splice(blogId, 1);
        res
            .status(204)
            .send();
    }
};
exports.deleteBlogController = deleteBlogController;
const createBlogController = (req, res) => {
    const newId = Date.parse(new Date().toISOString()).toString();
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const isValidate = true;
    if (isValidate) {
        const newBlog = {
            id: newId,
            name,
            description,
            websiteUrl,
        };
        db_1.db.blogs.push(newBlog);
        res
            .status(201)
            .json(newBlog);
    }
    else {
        res
            .status(400)
            .json({
            errorsMessages: apiErrors
        });
    }
};
exports.createBlogController = createBlogController;
const updateBlogController = (req, res) => {
    apiErrors = [];
    const blogId = db_1.db.blogs.findIndex(blog => blog.id === req.params.id);
    if (blogId === -1) {
        apiErrors.push({ field: "id", message: validationErrorsMassages.id });
        res
            .status(404)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        const name = req.body.name;
        const description = req.body.description;
        const websiteUrl = req.body.websiteUrl;
        const isValidate = true;
        if (isValidate) {
            const updatedPost = {
                id: db_1.db.blogs[blogId].id,
                name,
                description,
                websiteUrl,
            };
            db_1.db.blogs[blogId] = Object.assign({}, updatedPost);
            res
                .status(204)
                .send();
        }
        else {
            res
                .status(400)
                .json({
                errorsMessages: apiErrors
            });
        }
    }
};
exports.updateBlogController = updateBlogController;
