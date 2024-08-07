"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const express = __importStar(require("express"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
class AuthenticationController {
    constructor() {
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield AuthenticationService_1.default.getInstance().getAllUsers();
                res.status(200).send({ users: users });
            }
            catch (error) {
                res.status(400).send({ message: 'No users found!' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const userFound = yield AuthenticationService_1.default.getInstance().login(email, password);
                req.session.loggedin = true;
                if (!userFound)
                    res.status(400).send({ error: "Invalid Username or Password" });
                else {
                    res.status(200).send({ user: userFound });
                }
            }
            catch (_a) {
                throw new Error("Error");
            }
        });
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, userName } = req.body;
            try {
                yield AuthenticationService_1.default.getInstance().signup(email, password, userName);
                res.status(200).send({ message: 'You\'ve signed up successfuly!' });
            }
            catch (_b) {
                res.status(400).send({ message: 'User with this email already exists!' });
            }
        });
        this.deleteUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { emails } = req.query;
            try {
                const results = yield AuthenticationService_1.default.getInstance().deleteUsers(emails);
                res.status(200).send(results);
            }
            catch (_c) {
                res.status(400).send({ message: 'Delete user failed!' });
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/all', this.getAllUsers);
        this.router.post('/login', this.login);
        this.router.post('/signup', this.signup);
        this.router.delete('/deleteUsers', this.deleteUsers);
    }
}
exports.AuthenticationController = AuthenticationController;
