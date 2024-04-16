import { Request, Response, NextFunction } from "express"
import { apiRequestsCollection } from "../db/db"
import { StatusCodes } from "../settings";

const REQUESTS_LOG_SETTING = {
    maxCount: 5,
    timeRange: 10
}

export const apiRequestsLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip || 'unknown';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();

    await apiRequestsCollection.insertOne({ IP: ipAddress, URL: baseUrl, date: currentDate })
    next()
}

export const apiRequestsCounterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip || 'unknown';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - REQUESTS_LOG_SETTING.timeRange * 1000);
    const requestsCount = await apiRequestsCollection.countDocuments({ IP: ipAddress, URL: baseUrl, date: { $gte: tenSecondsAgo } })
    if (requestsCount <= REQUESTS_LOG_SETTING.maxCount) {
        return next()
    }
    return res
        .status(StatusCodes.TOO_MANY_REQUESTS_429)
        .send()
}