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
const settings_1 = require("../settings");
const apiRequests_model_1 = require("../db/mongo/apiRequests.model");
const REQUESTS_LOG_SETTING = {
    maxCount: 5,
    timeRange: 10
};
const apiRequestsLogMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip || '0.0.0.0';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    const request = new apiRequests_model_1.ApiRequestsModel({ IP: ipAddress, URL: baseUrl, date: currentDate });
    request.save();
    next();
});
exports.apiRequestsLogMiddleware = apiRequestsLogMiddleware;
const apiRequestsCounterMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip || '0.0.0.0';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - REQUESTS_LOG_SETTING.timeRange * 1000);
    const requestsCount = yield apiRequests_model_1.ApiRequestsModel.countDocuments({ IP: ipAddress, URL: baseUrl, date: { $gte: tenSecondsAgo } });
    if (requestsCount <= REQUESTS_LOG_SETTING.maxCount) {
        return next();
    }
    return res
        .status(settings_1.StatusCodes.TOO_MANY_REQUESTS_429)
        .send();
});
exports.apiRequestsCounterMiddleware = apiRequestsCounterMiddleware;
