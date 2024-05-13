"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSanitizationQuery = void 0;
const defaultSearchQueryParameters = {
    pageNumber: 1,
    pageSize: 10,
    maxPageSize: 100,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchLoginTerm: null,
    searchEmailTerm: null,
    searchNameTerm: null,
};
const getSanitizationQuery = (query) => {
    return {
        pageNumber: !isNaN(query === null || query === void 0 ? void 0 : query.pageNumber) ? +query.pageNumber : defaultSearchQueryParameters.pageNumber,
        pageSize: !isNaN(query === null || query === void 0 ? void 0 : query.pageSize) || (query === null || query === void 0 ? void 0 : query.pageSize) <= defaultSearchQueryParameters.maxPageSize ? +query.pageSize : defaultSearchQueryParameters.pageSize,
        sortBy: (query === null || query === void 0 ? void 0 : query.sortBy) ? query.sortBy : defaultSearchQueryParameters.sortBy,
        sortDirection: (query === null || query === void 0 ? void 0 : query.sortDirection) ? query.sortDirection : defaultSearchQueryParameters.sortDirection,
        searchLoginTerm: (query === null || query === void 0 ? void 0 : query.searchLoginTerm) ? query.searchLoginTerm : defaultSearchQueryParameters.searchLoginTerm,
        searchEmailTerm: (query === null || query === void 0 ? void 0 : query.searchEmailTerm) ? query.searchEmailTerm : defaultSearchQueryParameters.searchEmailTerm,
        searchNameTerm: (query === null || query === void 0 ? void 0 : query.searchNameTerm) ? query.searchNameTerm : defaultSearchQueryParameters.searchNameTerm,
    };
};
exports.getSanitizationQuery = getSanitizationQuery;
