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
exports.rateLimitMiddleware = void 0;
const db_1 = require("../db/db");
const rateLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip || 'unknown';
    const baseUrl = req.baseUrl || req.originalUrl;
    const currentDate = new Date();
    yield db_1.apiRequestsCollection.insertOne({ IP: ipAddress, URL: baseUrl, date: currentDate });
    const tenSecondsAgo = new Date(currentDate.getTime() - 10000);
    console.log(yield db_1.apiRequestsCollection.countDocuments({ IP: req.ip || 'unknown', URL: req.baseUrl || req.originalUrl, date: { $gte: tenSecondsAgo } }));
    next();
});
exports.rateLimitMiddleware = rateLimitMiddleware;
