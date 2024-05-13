"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginator = exports.SuccessResult = exports.Result = void 0;
const settings_1 = require("../settings");
class Result {
    constructor(status, data, errors) {
        this.status = status;
        this.data = data;
        this.errors = errors;
    }
}
exports.Result = Result;
class SuccessResult extends Result {
    constructor(data) {
        super(settings_1.ResultStatus.Success, data, null);
    }
}
exports.SuccessResult = SuccessResult;
class Paginator {
    constructor(page, pageSize, totalCount, items) {
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
        this.pagesCount = Math.ceil(this.totalCount / this.pageSize);
    }
}
exports.Paginator = Paginator;
