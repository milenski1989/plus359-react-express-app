"use strict";
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
exports.updateLocation = exports.updateEntry = exports.deleteOriginalFromS3 = exports.deleteFromS3 = exports.getFreeCells = exports.searchArts = exports.updateBio = exports.getBio = exports.getArts = exports.uploadEntry = exports.signup = exports.login = void 0;
const s3Client_1 = __importDefault(require("../s3Client/s3Client"));
const AdminServices_1 = require("../services/AdminServices");
require("dotenv/config");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userFound = yield (0, AdminServices_1.loginService)(email, password);
        req.session.loggedin = true;
        if (!userFound)
            res.status(400).send({ error: "Invalid Username or Password" });
        else
            res.status(200).send(userFound);
    }
    catch (_a) {
        throw new Error("Error");
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName } = req.body;
    try {
        yield (0, AdminServices_1.signupService)(email, password, userName);
        res.status(200).send({ message: 'You\'ve signed up successfuly!' });
    }
    catch (_b) {
        throw new Error("User with this email already exists");
    }
});
exports.signup = signup;
const uploadEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
    const image_url = req.file.transforms[0].location;
    const image_key = req.file.transforms[0].key;
    const download_url = req.file.transforms[1].location;
    const download_key = req.file.transforms[1].key;
    try {
        const results = yield (0, AdminServices_1.uploadService)(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, image_url, image_key, download_url, download_key, by_user);
        res.status(200).json({ results: results });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.uploadEntry = uploadEntry;
const getArts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, count, sortField, sortOrder } = req.query;
    const { name } = req.params;
    try {
        const [arts, artsCount] = yield (0, AdminServices_1.getArtsService)(name, page, count, sortField, sortOrder);
        res.status(200).json({ arts, artsCount });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getArts = getArts;
const getBio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const bio = yield (0, AdminServices_1.getBioService)(name);
        res.status(200).json(bio);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getBio = getBio;
const updateBio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bio } = req.body;
    const { id } = req.params;
    try {
        const result = yield (0, AdminServices_1.updateBioService)(id, bio);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updateBio = updateBio;
const searchArts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { param } = req.params;
    try {
        const results = yield (0, AdminServices_1.searchService)(param);
        res.status(200).json(results);
    }
    catch (_c) {
        throw new Error("No entries found");
    }
});
exports.searchArts = searchArts;
const getFreeCells = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cell } = req.params;
    try {
        const results = yield (0, AdminServices_1.getCellsService)(cell);
        res.status(200).json(results);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getFreeCells = getFreeCells;
const deleteFromS3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    try {
        yield s3Client_1.default.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename }).promise();
        const results = yield (0, AdminServices_1.deleteArtService)(filename);
        res.send(results);
    }
    catch (error) {
        res.send({ error: error.message });
    }
});
exports.deleteFromS3 = deleteFromS3;
const deleteOriginalFromS3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const originalFilename = req.params.originalFilename;
    yield s3Client_1.default.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: originalFilename }).promise();
});
exports.deleteOriginalFromS3 = deleteOriginalFromS3;
const updateEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
    const { id } = req.params;
    try {
        const results = yield (0, AdminServices_1.updateArtService)(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user, id);
        res.status(200).send(results);
    }
    catch (error) {
        throw new Error("Could not update entry!");
    }
});
exports.updateEntry = updateEntry;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids, formControlData } = req.body;
    try {
        const results = yield (0, AdminServices_1.updateLocationService)(ids, formControlData);
        res.status(200).send(results);
    }
    catch (error) {
        throw new Error("Could not update locations!");
    }
});
exports.updateLocation = updateLocation;
