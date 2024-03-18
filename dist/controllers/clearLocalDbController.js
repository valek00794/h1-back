"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLocalDbController = void 0;
const db_1 = require("../db/db");
const clearLocalDbController = (req, res) => {
    (0, db_1.setDB)();
    res
        .status(204)
        .send();
};
exports.clearLocalDbController = clearLocalDbController;
