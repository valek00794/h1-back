"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const commentsControllers_1 = require("../controllers/commentsControllers");
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get('/:id', authMiddleware_1.authMiddleware, commentsControllers_1.findCommentController);
exports.commentsRouter.delete('/:id', authMiddleware_1.authMiddleware, commentsControllers_1.deleteCommentController);
