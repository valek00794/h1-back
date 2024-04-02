"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const settings_1 = require("../settings");
const inputValidationMiddleware = (req, res, next) => {
    let apiErrors = [];
    const result = (0, express_validator_1.validationResult)(req);
    const resultWithFormater = result.formatWith(error => error);
    if (!result.isEmpty()) {
        resultWithFormater.array().forEach((error) => {
            const errorIsExists = apiErrors.findIndex(el => el.field === error.path);
            if (errorIsExists === -1) {
                apiErrors.push({ "message": error.msg, "field": error.path });
            }
            else {
                apiErrors[errorIsExists].message = apiErrors[errorIsExists].message + ' and ' + error.msg;
            }
        });
        res
            .status(settings_1.CodeResponses.BAD_REQUEST_400)
            .json({
            errorsMessages: apiErrors
        });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
