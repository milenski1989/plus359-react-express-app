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
class StorageController {
    constructor() {
        this.getAllStorages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield StorageService_1.default.getInstance().getAllStorages();
                res.status(200).json(results);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.getAllStoragesWithNoEntries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield StorageService_1.default.getInstance().getAllStoragesWithNoEntries();
                res.status(200).json(results);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.getSparePositions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cell, storage } = req.params;
            try {
                const results = yield StorageService_1.default.getInstance().getSparePositions(cell, storage);
                res.status(200).json(results);
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.getAllCellsFromCurrentStorage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { currentStorage } = req.params;
            try {
                const cellsNames = yield StorageService_1.default.getInstance().getAllCellsFromCurrentStorage(currentStorage);
                res.status(200).json(cellsNames);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
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
        this.saveStorage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            try {
                const results = yield StorageService_1.default.getInstance().saveStorage(name);
                res.status(200).send(results);
            }
            catch (error) {
                res.status(400).send("Storage with this name already exists!");
            }
        });
        this.deleteStorage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            try {
                const results = yield StorageService_1.default.getInstance().deleteStorage(name);
                res.status(200).send(results);
            }
            catch (_a) {
                res.status(400).send({ message: 'Delete storage failed!' });
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/allStorages", this.getAllStorages);
        this.router.get("/storagesWithNoEntries", this.getAllStoragesWithNoEntries);
        this.router.get("/:cell/:storage", this.getSparePositions);
        this.router.get("/all/allCellsFromCurrentStorage/:currentStorage", this.getAllCellsFromCurrentStorage);
        this.router.post("/saveOne", this.saveStorage);
        this.router.put("/update-location", this.updateLocation);
        this.router.delete("/deleteOne", this.deleteStorage);
    }
}
exports.StorageController = StorageController;
