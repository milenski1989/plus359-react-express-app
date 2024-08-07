"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const AuthenticationController_1 = require("../src/controllers/AuthenticationController");
const ArtworksController_1 = require("../src/controllers/ArtworksController");
const S3Controller_1 = require("../src/controllers/S3Controller");
const StorageController_1 = require("../src/controllers/StorageController");
const PdfController_1 = require("../src/controllers/PdfController");
const BiosController_1 = require("../src/controllers/BiosController");
const ArtistsController_1 = require("../src/controllers/ArtistsController");
dotenv_1.default.config();
const app = (0, express_1.default)();
//app.use(express.static(path.join(__dirname, '/build')));
//package.json old:
// "start": "nodemon --exec ts-node-dev --respawn --transpile-only ./src/index.ts",
// "build": "tsc",
// "dev": "nodemon --exec ts-node-dev --respawn --transpile-only ./src/index.ts",
// "postinstall": "npm run build",
app.use((0, cors_1.default)({ origin: "https://storage-management-app-client.vercel.app" }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));
const authController = new AuthenticationController_1.AuthenticationController();
const artworksController = new ArtworksController_1.ArtworksController();
const s3Controller = new S3Controller_1.S3Controller();
const storageController = new StorageController_1.StorageController();
const pdfController = new PdfController_1.PdfController();
const biosController = new BiosController_1.BiosController();
const artistsController = new ArtistsController_1.ArtistsController();
app.use('/auth', authController.router);
app.use('/artworks', artworksController.router);
app.use('/s3', s3Controller.router);
app.use('/storage', storageController.router);
app.use('/pdf', pdfController.router);
app.use('/bios', biosController.router);
app.use('/artists', artistsController.router);
// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname+'/build/index.html'));
//   });
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is connected on ${5000}`));
