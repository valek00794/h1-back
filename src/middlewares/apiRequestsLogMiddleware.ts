import { Request, Response, NextFunction } from "express"

import { StatusCodes } from "../settings";
import { ApiRequestsModel } from "../db/mongo/apiRequests.model";

const REQUESTS_LOG_SETTING = {
    maxCount: 5,
    timeRange: 10
}

export const apiRequestsLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip || '0.0.0.0';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();

    const request = new ApiRequestsModel({ IP: ipAddress, URL: baseUrl, date: currentDate })
    request.save()
    next()
}

export const apiRequestsCounterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.ip || '0.0.0.0';
    const baseUrl = req.originalUrl;
    const currentDate = new Date();
    const tenSecondsAgo = new Date(currentDate.getTime() - REQUESTS_LOG_SETTING.timeRange * 1000);
    const requestsCount = await ApiRequestsModel.countDocuments({ IP: ipAddress, URL: baseUrl, date: { $gte: tenSecondsAgo } })
    if (requestsCount <= REQUESTS_LOG_SETTING.maxCount) {
        return next()
    }
    return res
        .status(StatusCodes.TOO_MANY_REQUESTS_429)
        .send()
}