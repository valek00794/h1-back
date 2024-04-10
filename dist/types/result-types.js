"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultStatus = void 0;
var ResultStatus;
(function (ResultStatus) {
    ResultStatus[ResultStatus["OK_200"] = 200] = "OK_200";
    ResultStatus[ResultStatus["CREATED_201"] = 201] = "CREATED_201";
    ResultStatus[ResultStatus["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    ResultStatus[ResultStatus["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    ResultStatus[ResultStatus["UNAUTHORIZED_401"] = 401] = "UNAUTHORIZED_401";
    ResultStatus[ResultStatus["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
    ResultStatus[ResultStatus["FORBIDDEN_403"] = 403] = "FORBIDDEN_403";
})(ResultStatus || (exports.ResultStatus = ResultStatus = {}));
