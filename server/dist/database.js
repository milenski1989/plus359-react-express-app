"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./entities/User");
const Artworks_1 = require("./entities/Artworks");
dotenv_1.default.config();
exports.dbConnection = new typeorm_1.DataSource({
    type: 'mysql',
    username: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    port: 3306,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    logging: true,
    synchronize: true,
    entities: [
        User_1.User, Artworks_1.Artworks
    ]
});
