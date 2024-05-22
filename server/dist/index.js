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
const path_1 = __importDefault(require("path"));
const AuthenticationController_1 = require("./controllers/AuthenticationController");
const ArtworksController_1 = require("./controllers/ArtworksController");
const S3Controller_1 = require("./controllers/S3Controller");
const StorageController_1 = require("./controllers/StorageController");
const PdfController_1 = require("./controllers/PdfController");
const BiosController_1 = require("./controllers/BiosController");
const ArtistsController_1 = require("./controllers/ArtistsController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '/build')));
const origin = process.env.NODE_ENV === 'production' ? "https://app.plus359gallery.com" : "http://localhost:3000";
const domain = process.env.NODE_ENV === 'production' ? 'app.plus359gallery.com' : 'localhost';
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", `object-src 'none'; script-src 'self'; base-uri 'self'`);
    res.setHeader("Referrer-Policy", "no-referrer");
    if (req.secure) {
        res.setHeader("Strict-Transport-Security", "max-age=15778463; includeSubDomains");
    }
    next();
});
const sessionSecret = process.env.EXPRESS_SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("EXPRESS_SESSION_SECRET is not defined");
}
app.use((0, cors_1.default)({ origin: origin, credentials: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        domain: domain,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
    }
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
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/build/index.html'));
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is connected on ${5000}`));
