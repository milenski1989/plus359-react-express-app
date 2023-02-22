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
exports.updateArtService = exports.deleteArtService = exports.getCellsService = exports.getArtsService = exports.uploadService = exports.signupService = exports.loginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../entities/User");
const database_1 = require("../database");
const Artworks_1 = require("../entities/Artworks");
const saltRounds = 10;
database_1.dbConnection
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const userRepository = database_1.dbConnection.getRepository(User_1.User);
const artsRepository = database_1.dbConnection.getRepository(Artworks_1.Artworks);
//login
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    let authenticated;
    try {
        let userFound = yield userRepository.findOneBy({
            email: email
        });
        if (userFound) {
            authenticated = yield bcrypt_1.default.compare(password, userFound.password);
        }
        if (authenticated)
            return userFound;
        else
            throw new Error("Invalid credentials");
    }
    catch (_a) {
        throw new Error("Invalid credentials");
    }
});
exports.loginService = loginService;
//signup
const signupService = (email, password, userName) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    let userFound = yield userRepository.findOneBy({
        email: email
    });
    console.log(userFound);
    try {
        if (!userFound) {
            bcrypt_1.default.hash(password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw new Error("Signup failed!");
                user = yield userRepository.create({
                    email: email,
                    password: hash,
                    userName: userName,
                    superUser: 1
                });
                console.log('user', user);
                yield database_1.dbConnection.getRepository(User_1.User).save(user);
                return user;
            }));
        }
        else {
            throw new Error("exists");
        }
    }
    catch (_b) {
        throw new Error("Error occured while register");
    }
});
exports.signupService = signupService;
//upload to Artworks after object is created in the S3 Bucket
const uploadService = (title, artist, technique, dimensions, price, notes, onWall, inExhibition, storageLocation, cell, position, image_url, image_key, download_url, download_key, by_user) => __awaiter(void 0, void 0, void 0, function* () {
    let newEntry;
    try {
        newEntry = yield artsRepository.create({
            title,
            artist,
            technique,
            dimensions,
            price,
            notes,
            onWall,
            inExhibition,
            storageLocation,
            cell,
            position,
            image_url,
            image_key,
            download_url,
            download_key,
            by_user
        });
        const results = yield artsRepository.save(newEntry);
        return results;
    }
    catch (_c) {
        throw new Error("Upload failed");
    }
});
exports.uploadService = uploadService;
//get all entries from database
const getArtsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('invoked 1');
        const results = yield artsRepository.find({
            order: {
                id: "DESC",
            },
        });
        return results;
    }
    catch (_d) {
        throw new Error("Fetch failed!");
    }
});
exports.getArtsService = getArtsService;
const getCellsService = (cell) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('invoked 2');
        const results = yield artsRepository.find({
            where: {
                cell: cell
            }
        });
        return results;
    }
    catch (_e) {
        throw new Error("Error getting free positions in the selected cell");
    }
});
exports.getCellsService = getCellsService;
//delete one from database
const deleteArtService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield artsRepository.delete(id);
        return results;
    }
    catch (_f) {
        throw new Error("Could not delete the entry!");
    }
});
exports.deleteArtService = deleteArtService;
//update in database
const updateArtService = (title, artist, technique, dimensions, price, notes, onWall, inExhibition, storageLocation, cell, position, by_user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedEntry = { title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        onWall,
        inExhibition,
        storageLocation,
        cell,
        position,
        by_user };
    try {
        const item = yield artsRepository.findOneBy({
            id: id
        });
        console.log('item:', item);
        yield artsRepository.merge(item, updatedEntry);
        const results = yield artsRepository.save(item);
        return results;
    }
    catch (_g) {
        throw new Error("Could not update entry");
    }
});
exports.updateArtService = updateArtService;
