"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDevicesOutput = exports.CommentatorInfo = exports.UserInfo = exports.UserView = void 0;
class UserView {
    constructor(id, login, email, createdAt) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.createdAt = createdAt;
    }
}
exports.UserView = UserView;
class UserInfo {
    constructor(userId, login, email) {
        this.userId = userId;
        this.login = login;
        this.email = email;
    }
}
exports.UserInfo = UserInfo;
class CommentatorInfo {
    constructor(userId, userLogin, email) {
        this.userId = userId;
        this.userLogin = userLogin;
        this.email = email;
    }
}
exports.CommentatorInfo = CommentatorInfo;
class UsersDevicesOutput {
    constructor(ip, title, deviceId, lastActiveDate) {
        this.ip = ip;
        this.title = title;
        this.deviceId = deviceId;
        this.lastActiveDate = lastActiveDate;
    }
}
exports.UsersDevicesOutput = UsersDevicesOutput;
