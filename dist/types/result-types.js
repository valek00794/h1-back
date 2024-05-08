"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginator = exports.Result = void 0;
class Result {
    constructor(status, data, errors) {
        this.status = status;
        this.data = data;
        this.errors = errors;
    }
}
exports.Result = Result;
class Paginator {
    constructor(pagesCount, page, pageSize, totalCount, items) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}
exports.Paginator = Paginator;
