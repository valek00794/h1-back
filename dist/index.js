"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const settings_1 = require("./settings");
const db_1 = require("./db/db");
const videos_router_1 = require("./routers/videos-router");
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const clearLocalDbController_1 = require("./controllers/clearLocalDbController");
const clearDbController_1 = require("./controllers/clearDbController");
app_1.app.use(settings_1.SETTINGS.PATH.videos, videos_router_1.videosRouter);
app_1.app.use(settings_1.SETTINGS.PATH.posts, posts_router_1.postsRouter);
app_1.app.use(settings_1.SETTINGS.PATH.blogs, blogs_router_1.blogsRouter);
app_1.app.delete(settings_1.SETTINGS.PATH.clearDb, clearDbController_1.clearDbController);
app_1.app.delete(settings_1.SETTINGS.PATH.clearLocalDb, clearLocalDbController_1.clearLocalDbController);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app_1.app.listen(settings_1.SETTINGS.PORT, () => {
        console.log(`Example app listening on port ${settings_1.SETTINGS.PORT}`);
    });
});
startApp();
