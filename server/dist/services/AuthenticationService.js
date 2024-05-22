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
const typeorm_1 = require("typeorm");
const userRepository = database_1.dbConnection.getRepository(User_1.User);
class AuthenticationService {
    constructor() { }
    static getInstance() {
        if (!AuthenticationService.authenticationService) {
            AuthenticationService.authenticationService = new AuthenticationService();
        }
        return AuthenticationService.authenticationService;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userRepository.find();
                return users;
            }
            catch (error) {
                throw new Error('No users found!');
            }
        });
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
            try {
                const userFound = yield userRepository.findOneBy({ email: email });
                if (!userFound) {
                    const saltRounds = 10;
                    const hash = yield bcrypt_1.default.hash(password, saltRounds);
                    const user = userRepository.create({
                        email: email,
                        password: hash,
                        userName: userName,
                        superUser: 0
                    });
                    yield database_1.dbConnection.getRepository(User_1.User).save(user);
                    return { success: true, message: "You've signed up successfully!" };
                }
                else {
                    throw new Error("User with this email already exists!");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    deleteUsers(emails) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            try {
                const foundUsers = yield userRepository.find({ where: {
                        email: (0, typeorm_1.In)(emails)
                    } });
                if (foundUsers.length) {
                    for (let user of foundUsers) {
                        promises.push(userRepository.delete({ email: user.email }));
                    }
                    const result = yield Promise.all(promises);
                    return result;
                }
                else {
                    throw new Error('User with this email was not found!');
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = AuthenticationService;
