"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const settings_1 = require("../settings");
const result_types_1 = require("../types/result-types");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res
            .status(result_types_1.ResultStatus.UNAUTHORIZED_401)
            .send();
        return;
    }
    const buff = Buffer.from(authHeader.slice(6), 'base64');
    const decodedAuth = buff.toString('utf8');
    if (authHeader && (decodedAuth === settings_1.SETTINGS.ADMIN_AUTH) && (authHeader.slice(0, 6) === 'Basic ')) {
        next();
    }
    else {
        res
            .status(result_types_1.ResultStatus.UNAUTHORIZED_401)
            .send();
        return;
    }
};
exports.authMiddleware = authMiddleware;
