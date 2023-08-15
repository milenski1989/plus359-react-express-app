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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
const User_1 = require("../entities/User");
const userRepository = database_1.dbConnection.getRepository(User_1.User);
class AuthenticationService {
    constructor() { }
    static getInstance() {
        if (!AuthenticationService.authenticationService) {
            AuthenticationService.authenticationService = new AuthenticationService();
        }
        return AuthenticationService.authenticationService;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let authenticated;
            try {
                let userFound = yield userRepository.findOne({
                    where: [{ email: email }, { userName: email }]
                });
                if (userFound) {
                    authenticated = yield bcrypt_1.default.compare(password, userFound.password);
                    if (authenticated)
                        return userFound;
                }
                else
                    return userFound;
            }
            catch (error) {
                throw new Error("Invalid credentials");
            }
        });
    }
    ;
    signup(email, password, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            let userFound = yield userRepository.findOneBy({
                email: email
            });
            try {
                if (!userFound) {
                    const saltRounds = 10;
                    bcrypt_1.default.hash(password, saltRounds, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            throw new Error("Signup failed!");
                        user = userRepository.create({
                            email: email,
                            password: hash,
                            userName: userName,
                            superUser: 1
                        });
                        yield database_1.dbConnection.getRepository(User_1.User).save(user);
                    }));
                }
                else {
                    throw new Error("exists");
                }
            }
            catch (_a) {
                throw new Error("Error occured while registering!");
            }
        });
    }
    ;
}
exports.default = AuthenticationService;
