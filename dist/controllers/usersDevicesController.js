"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const inversify_1 = require("inversify");
const settings_1 = require("../settings");
const usersDevices_query_repository_1 = require("../repositories/usersDevices-query-repository");
const auth_service_1 = require("../services/auth-service");
const usersDevices_service_1 = require("../services/usersDevices-service");
let UsersDevicesController = class UsersDevicesController {
    constructor(authService, usersDevicesService, usersDevicesQueryRepository) {
        this.authService = authService;
        this.usersDevicesService = usersDevicesService;
        this.usersDevicesQueryRepository = usersDevicesQueryRepository;
    }
    getActiveDevicesByUserController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const devicesResult = yield this.usersDevicesService.getActiveDevicesByUser(refreshToken);
            if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            if (devicesResult.status === settings_1.ResultStatus.Success) {
                res
                    .status(settings_1.StatusCodes.OK_200)
                    .send(devicesResult.data);
                return;
            }
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
            const refreshToken = req.cookies.refreshToken;
            const devicesResult = yield this.usersDevicesService.deleteUserDeviceById(refreshToken, req.params.deviceId);
            if (devicesResult.status === settings_1.ResultStatus.Unauthorized) {
                res
                    .status(settings_1.StatusCodes.UNAUTHORIZED_401)
                    .send();
                return;
            }
            if (devicesResult.status === settings_1.ResultStatus.NotFound) {
                res
                    .status(settings_1.StatusCodes.NOT_FOUND_404)
                    .send();
                return;
            }
            if (devicesResult.status === settings_1.ResultStatus.Forbidden) {
                res
                    .status(settings_1.StatusCodes.FORBIDDEN_403)
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
};
exports.UsersDevicesController = UsersDevicesController;
exports.UsersDevicesController = UsersDevicesController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        usersDevices_service_1.UsersDevicesService,
        usersDevices_query_repository_1.UsersDevicesQueryRepository])
], UsersDevicesController);
