"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLocalDbController = void 0;
const db_1 = require("../db/db");
const result_types_1 = require("../types/result-types");
const clearLocalDbController = (req, res) => {
    (0, db_1.setDB)();
    res
        .status(result_types_1.ResultStatus.NO_CONTENT_204)
        .send();
};
exports.clearLocalDbController = clearLocalDbController;
