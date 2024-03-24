"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLocalDbController = void 0;
const db_1 = require("../db/db");
const settings_1 = require("../settings");
const clearLocalDbController = (req, res) => {
    (0, db_1.setDB)();
    res
        .status(settings_1.CodeResponses.NO_CONTENT_204)
        .send();
};
exports.clearLocalDbController = clearLocalDbController;
