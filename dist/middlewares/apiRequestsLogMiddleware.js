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
exports.apiRequestsCounterMiddleware = exports.apiRequestsLogMiddleware = void 0;
const db_1 = require("../db/db");
const settings_1 = require("../settings");
const REQUESTS_LOG_SETTING = {
    maxCount: 5,
    timeRange: 10
};
const apiRequestsLogMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip || 'unknown';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    yield db_1.apiRequestsCollection.insertOne({ IP: ipAddress, URL: baseUrl, date: currentDate });
    next();
});
exports.apiRequestsLogMiddleware = apiRequestsLogMiddleware;
const apiRequestsCounterMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip || 'unknown';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - REQUESTS_LOG_SETTING.timeRange * 1000);
    const requestsCount = yield db_1.apiRequestsCollection.countDocuments({ IP: ipAddress, URL: baseUrl, date: { $gte: tenSecondsAgo } });
    if (requestsCount <= REQUESTS_LOG_SETTING.maxCount) {
        return next();
    }
    return res
        .status(settings_1.StatusCodes.TOO_MANY_REQUESTS_429)
        .send();
});
exports.apiRequestsCounterMiddleware = apiRequestsCounterMiddleware;
