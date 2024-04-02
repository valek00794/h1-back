"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postsControllers_1 = require("../controllers/postsControllers");
const inputValidationMiddleware_1 = require("../middlewares/inputValidationMiddleware");
const postsInputValidation_1 = require("../validation/postsInputValidation");
const commentInputValidation_1 = require("../validation/commentInputValidation");
const commentsControllers_1 = require("../controllers/commentsControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', postsControllers_1.getPostsController);
exports.postsRouter.get('/:id', postsControllers_1.findPostController);
exports.postsRouter.post('/', authMiddleware_1.authMiddleware, postsInputValidation_1.postsInputValidation, postsInputValidation_1.postsBlogIdInputValidation, inputValidationMiddleware_1.inputValidationMiddleware, postsControllers_1.createPostController);
exports.postsRouter.put('/:id', authMiddleware_1.authMiddleware, postsInputValidation_1.postsInputValidation, postsInputValidation_1.postsBlogIdInputValidation, inputValidationMiddleware_1.inputValidationMiddleware, postsControllers_1.updatePostController);
exports.postsRouter.delete('/:id', authMiddleware_1.authMiddleware, postsControllers_1.deletePostController);
exports.postsRouter.post('/:postId/comments', authMiddleware_1.authMiddleware, commentInputValidation_1.commentInputValidation, inputValidationMiddleware_1.inputValidationMiddleware, commentsControllers_1.createCommentForPostController);
exports.postsRouter.get('/:postId/comments', commentsControllers_1.getCommentsForPostController);
