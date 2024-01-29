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
exports.ArtworksController = void 0;
const express = __importStar(require("express"));
const ArtworksService_1 = __importDefault(require("../services/ArtworksService"));
class ArtworksController {
    constructor() {
        this.getAllByStorage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page, count, sortField, sortOrder } = req.query;
            const { name } = req.params;
            try {
                const [arts, artsCount] = yield ArtworksService_1.default.getInstance().getAllByStorage(name, page, count, sortField, sortOrder);
                res.status(200).json({ arts, artsCount });
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.deleteFileFromS3andDB = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { originalFilename, filename, id } = req.query;
            console.log(req.query);
            try {
                const results = yield ArtworksService_1.default.getInstance().deleteFileFromS3AndDB(originalFilename, filename, id);
                res.send(results);
            }
            catch (error) {
                res.send({ error: error.message });
            }
        });
        this.updateArtwork = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
            const { id } = req.params;
            try {
                const results = yield ArtworksService_1.default.getInstance().updateArtwork(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user, id);
                res.status(200).send(results);
            }
            catch (error) {
                throw new Error("Could not update entry!");
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/:name', this.getAllByStorage);
        this.router.post('/artwork', this.searchAllByKeywords);
        this.router.delete('/artwork/:params', this.deleteFileFromS3andDB);
        this.router.put('/artwork/:id', this.updateArtwork);
    }
    searchAllByKeywords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keywords } = req.body;
            const { page, count, sortField, sortOrder } = req.query;
            try {
                const [arts, artsCount] = yield ArtworksService_1.default.getInstance().searchByKeywords(keywords, page, count, sortField, sortOrder);
                res.json({ arts, artsCount });
            }
            catch (error) {
                console.error('Error:', error);
                res.status(404).json({ error: 'No results from the search!' });
            }
        });
    }
}
exports.ArtworksController = ArtworksController;
