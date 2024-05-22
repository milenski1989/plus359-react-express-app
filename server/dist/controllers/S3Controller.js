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
exports.S3Controller = void 0;
const express = __importStar(require("express"));
const S3Service_1 = require("../services/S3Service");
const ArtworksService_1 = __importDefault(require("../services/ArtworksService"));
const s3Service = new S3Service_1.S3Service();
class S3Controller {
    constructor() {
        this.getArts = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this.replace = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const processRequestBody = () => __awaiter(this, void 0, void 0, function* () {
                const { id, old_image_key, old_download_key } = req.body;
                let image_url;
                let image_key;
                let download_url;
                let download_key;
                image_url = req.file.transforms[0].location;
                image_key = req.file.transforms[0].key;
                download_url = req.file.transforms[1].location;
                download_key = req.file.transforms[1].key;
                const entryFound = yield ArtworksService_1.default.getInstance().getOneById(id);
                if (entryFound)
                    yield ArtworksService_1.default.getInstance().updateImageData(old_image_key, old_download_key, entryFound.id, image_url, image_key, download_url, download_key);
                res.status(200).json({ result: "Photo replaced successfuly" });
            });
            try {
                s3Service.uploadSingleFile('file')(req, res, (uploadErr) => __awaiter(this, void 0, void 0, function* () {
                    if (uploadErr) {
                        return res.status(400).json({ error: 'File upload failed' });
                    }
                    yield processRequestBody();
                }));
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.upload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const processRequestBody = () => __awaiter(this, void 0, void 0, function* () {
                const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
                let image_url;
                let image_key;
                let download_url;
                let download_key;
                image_url = req.file.transforms[0].location;
                image_key = req.file.transforms[0].key;
                // let originalString = req.file.transforms[1].location;
                // let removedString = originalString.replace(/plus359gallery\//, "");
                // download_url = "https://plus359gallery." + removedString;
                download_url = req.file.transforms[1].location;
                download_key = req.file.transforms[1].key;
                const cellParam = cell ? cell : null;
                const positionParam = position ? position : null;
                yield ArtworksService_1.default.getInstance().saveEntryInDb(title, artist, technique, dimensions, price, notes, storageLocation, cellParam, positionParam, image_url, image_key, download_url, download_key, by_user);
                res.status(200).json({
                    results: {
                        image_url,
                        image_key,
                        download_url,
                        download_key,
                    },
                });
            });
            try {
                s3Service.uploadSingleFile('file')(req, res, (uploadErr) => __awaiter(this, void 0, void 0, function* () {
                    if (uploadErr) {
                        return res.status(400).json({ error: 'File upload failed!' });
                    }
                    yield processRequestBody();
                }));
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/upload', this.upload);
        this.router.post('/replace', this.replace);
        this.router.get('/:name', this.getArts);
    }
}
exports.S3Controller = S3Controller;
