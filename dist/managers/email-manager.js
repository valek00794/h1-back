"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailManager = void 0;
const email_adatper_1 = require("../adapters/email-adatper");
exports.emailManager = {
    sendEmailConfirmationMessage(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Email confirmation';
            const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href=\'https://somesite.com/auth/registration-confirmation?code=${code}\'> complete registration</a></p>`;
            email_adatper_1.emailAdapter.send(email, subject, message);
        });
    },
    sendEmailPasswordRecoveryMessage(email, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Password recovery';
            const message = ` <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
           <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
       </p>`;
            email_adatper_1.emailAdapter.send(email, subject, message);
        });
    }
};
