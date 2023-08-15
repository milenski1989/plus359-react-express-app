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
const ArtistsBios_1 = require("./entities/ArtistsBios");
const Artists_1 = require("./entities/Artists");
dotenv_1.default.config();
exports.dbConnection = new typeorm_1.DataSource({
    type: 'mysql',
    username: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    port: 5432,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    logging: true,
    synchronize: false,
    entities: [
        User_1.User, Artworks_1.Artworks, Artists_1.Artists, ArtistsBios_1.ArtistsBios
    ]
});
exports.dbConnection
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
