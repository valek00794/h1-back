"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const express_1 = __importDefault(require("express"));
const clearDbController_1 = require("./controllers/clearDbController");
const blogsControllers_1 = require("./controllers/blogsControllers");
const postsControllers_1 = require("./controllers/postsControllers");
const videosControllers_1 = require("./controllers/videosControllers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(settings_1.SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${settings_1.SETTINGS.PORT}`);
});
app.get(settings_1.SETTINGS.PATH.videos, videosControllers_1.getVideosController);
app.get(settings_1.SETTINGS.PATH.videosById, videosControllers_1.findVideoController);
app.post(settings_1.SETTINGS.PATH.videos, videosControllers_1.createVideoController);
app.delete(settings_1.SETTINGS.PATH.videosById, videosControllers_1.deleteVideoController);
app.put(settings_1.SETTINGS.PATH.videosById, videosControllers_1.updateVideoController);
app.delete(settings_1.SETTINGS.PATH.videosById, clearDbController_1.clearDbController);
app.get(settings_1.SETTINGS.PATH.blogs, blogsControllers_1.getBlogsController);
app.get(settings_1.SETTINGS.PATH.posts, postsControllers_1.getPostsController);
app.get(settings_1.SETTINGS.PATH.postsById, postsControllers_1.findPostController);
app.get(settings_1.SETTINGS.PATH.blogsById, blogsControllers_1.findBlogController);
app.delete(settings_1.SETTINGS.PATH.postsById, postsControllers_1.deletePostController);
app.delete(settings_1.SETTINGS.PATH.blogsById, blogsControllers_1.deleteBlogController);
