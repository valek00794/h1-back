"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const settings_1 = require("../settings");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const buff = Buffer.from(authHeader.slice(6), 'base64');
    const decodedAuth = buff.toString('utf8');
    if (authHeader && (decodedAuth === settings_1.SETTINGS.ADMIN_AUTH) && (authHeader.slice(0, 6) === 'Basic ')) {
        next();
    }
    else {
        res
            .status(401)
            .send();
        return;
    }
};
exports.authMiddleware = authMiddleware;
