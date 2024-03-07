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
exports.StorageController = void 0;
const express = __importStar(require("express"));
const StorageService_1 = __importDefault(require("../services/StorageService"));
const ArtworksService_1 = __importDefault(require("../services/ArtworksService"));
class StorageController {
    constructor() {
        this.getFreeCells = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cell } = req.params;
            try {
                const results = yield StorageService_1.default.getInstance().getFreeCells(cell);
                res.status(200).json(results);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.getAllCellsFromCurrentStorage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentStorage } = req.params;
            let cells;
            try {
                if (currentStorage !== 'All') {
                    const arts = yield ArtworksService_1.default.getInstance().getAllByCellFromCurrentStorage(currentStorage);
                    cells = arts
                        .map(art => art.cell)
                        .filter(cell => cell !== "")
                        .sort((a, b) => a.localeCompare(b));
                }
                else {
                    const arts = yield ArtworksService_1.default.getInstance().getAll();
                    cells = arts
                        .map(art => art.cell)
                        .filter(cell => cell !== "")
                        .sort((a, b) => a.localeCompare(b));
                }
                res.status(200).json(cells);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        this.updateLocation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ids, formControlData } = req.body;
            try {
                const results = yield StorageService_1.default.getInstance().updateLocation(ids, formControlData);
                res.status(200).send(results);
            }
            catch (error) {
                throw new Error("Could not update locations!");
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/:cell', this.getFreeCells);
        this.router.get('/all/allCellsFromCurrentStorage/:currentStorage', this.getAllCellsFromCurrentStorage);
        this.router.put('/update-location', this.updateLocation);
    }
}
exports.StorageController = StorageController;
