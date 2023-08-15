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
exports.BiosController = void 0;
const express = __importStar(require("express"));
const BiosService_1 = __importDefault(require("../services/BiosService"));
class BiosController {
    constructor() {
        this.getBio = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            try {
                const bio = yield BiosService_1.default.getInstance().getBio(name);
                res.status(200).json(bio);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.updateBio = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { bio } = req.body;
            const { id } = req.params;
            try {
                const result = yield BiosService_1.default.getInstance().updateBio(id, bio);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/bio/:name', this.getBio);
        this.router.put('/bio/:id', this.updateBio);
    }
}
exports.BiosController = BiosController;
