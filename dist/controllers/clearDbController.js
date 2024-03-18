"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDbController = void 0;
const db_1 = require("../db/db");
const clearDbController = (req, res) => {
    (0, db_1.setMongoDB)();
    res
        .status(204)
        .send();
};
exports.clearDbController = clearDbController;
