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
const router_1 = __importDefault(require("./routes/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '/build')));
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));
app.use('/api', router_1.default);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/build/index.html'));
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
