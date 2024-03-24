"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDbController = void 0;
const db_1 = require("../db/db");
const settings_1 = require("../settings");
const clearDbController = (req, res) => {
    (0, db_1.setMongoDB)();
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
};
exports.clearDbController = clearDbController;
