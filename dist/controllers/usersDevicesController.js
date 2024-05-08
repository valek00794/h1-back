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
exports.UsersDevicesController = void 0;
const settings_1 = require("../settings");
class UsersDevicesController {
    constructor(authService, usersDevicesService, usersDevicesQueryRepository) {
        this.authService = authService;
        this.usersDevicesService = usersDevicesService;
        this.usersDevicesQueryRepository = usersDevicesQueryRepository;
    }
    getActiveDevicesByUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const userVerifyInfo = yield this.authService.checkUserByRefreshToken(refreshToken);
            if (userVerifyInfo.data === null) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const devices = yield this.usersDevicesQueryRepository.getAllActiveDevicesByUser(userVerifyInfo.data.userId);
            res
                .status(settings_1.StatusCodes.OK_200)
                .send(devices);
            return;
        });
    }
    deleteAllDevicesByUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const devicesResult = yield this.usersDevicesService.deleteAllDevicesByUser(refreshToken);
            if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            if (devicesResult.status === settings_1.ResultStatus.NoContent) {
                res
                    .status(settings_1.StatusCodes.NO_CONTENT_204)
                    .send();
                return;
            }
        });
    }
    deleteUserDeviceByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userVerifyInfo = yield this.authService.checkUserByRefreshToken(req.cookies.refreshToken);
            if (userVerifyInfo.data === null) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            const device = yield this.usersDevicesQueryRepository.getUserDeviceById(req.params.deviceId);
            if (device === null) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            if (userVerifyInfo.data.userId !== device.userId) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
                    .send();
                return;
            }
            yield this.usersDevicesService.deleteUserDeviceById(userVerifyInfo.data.userId);
            res
                .status(settings_1.StatusCodes.NO_CONTENT_204)
                .send();
            return;
        });
    }
}
exports.UsersDevicesController = UsersDevicesController;
