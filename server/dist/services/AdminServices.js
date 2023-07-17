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
exports.createCertificateService = exports.updateLocationService = exports.updateArtService = exports.deleteArtService = exports.getCellsService = exports.searchService = exports.updateBioService = exports.getBioService = exports.getArtsService = exports.uploadService = exports.signupService = exports.loginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../entities/User");
const database_1 = require("../database");
const Artworks_1 = require("../entities/Artworks");
const typeorm_1 = require("typeorm");
const Artists_1 = require("../entities/Artists");
const ArtistsBios_1 = require("../entities/ArtistsBios");
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
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
const artistsRepository = database_1.dbConnection.getRepository(Artists_1.Artists);
const biosRepository = database_1.dbConnection.getRepository(ArtistsBios_1.ArtistsBios);
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    let authenticated;
    try {
        let userFound = yield userRepository.findOne({
            where: [{ email: email }, { userName: email }]
        });
        if (userFound) {
            authenticated = yield bcrypt_1.default.compare(password, userFound.password);
            if (authenticated)
                return userFound;
        }
        else
            return userFound;
    }
    catch (error) {
        throw new Error("Invalid credentials");
    }
});
exports.loginService = loginService;
const signupService = (email, password, userName) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    let userFound = yield userRepository.findOneBy({
        email: email
    });
    try {
        if (!userFound) {
            bcrypt_1.default.hash(password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw new Error("Signup failed!");
                user = userRepository.create({
                    email: email,
                    password: hash,
                    userName: userName,
                    superUser: 1
                });
                yield database_1.dbConnection.getRepository(User_1.User).save(user);
            }));
        }
        else {
            throw new Error("exists");
        }
    }
    catch (_a) {
        throw new Error("Error occured while registering!");
    }
});
exports.signupService = signupService;
const uploadService = (title, artist, technique, dimensions, price, notes, storageLocation, cell, position, image_url, image_key, download_url, download_key, by_user) => __awaiter(void 0, void 0, void 0, function* () {
    let newEntry;
    try {
        newEntry = yield artsRepository.create({
            title,
            artist,
            technique,
            dimensions,
            price,
            notes,
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
    catch (_b) {
        throw new Error("Upload failed");
    }
});
exports.uploadService = uploadService;
const getArtsService = (name, page, count, sortField, sortOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [arts, artsCount] = yield artsRepository.findAndCount({
            order: { [sortField]: sortOrder.toUpperCase() },
            where: { storageLocation: name },
            take: parseInt(count),
            skip: (parseInt(count) * parseInt(page)) - parseInt(count)
        });
        return [arts, artsCount];
    }
    catch (_c) {
        throw new Error("Fetch failed!");
    }
});
exports.getArtsService = getArtsService;
const getBioService = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bio;
        const artist = yield artistsRepository.findOne({
            where: {
                artist: name
            }
        });
        if (!artist) {
            throw new Error('Artist not found!');
        }
        else {
            bio = yield biosRepository.findOne({
                where: {
                    id: artist.id,
                },
            });
        }
        return bio;
    }
    catch (_d) {
        throw new Error('No bio for this artist found!');
    }
});
exports.getBioService = getBioService;
const updateBioService = (id, bio) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioFound = yield biosRepository.findOneBy({
            id: id
        });
        yield biosRepository.merge(bioFound, Object.assign(Object.assign({}, bioFound), { bio: bio }));
        const results = yield biosRepository.save(bioFound);
        return results;
    }
    catch (error) {
        console.log({ error });
        throw new Error("Could not update entry");
    }
});
exports.updateBioService = updateBioService;
const searchService = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield artsRepository.find({ where: [
                { artist: (0, typeorm_1.Like)(`%${params}%`) },
                { technique: (0, typeorm_1.Like)(`%${params}%`) },
                { title: (0, typeorm_1.Like)(`%${params}%`) },
                { storageLocation: (0, typeorm_1.Like)(`%${params}%`) },
                { dimensions: (0, typeorm_1.Like)(`%${params}%`) },
                { notes: (0, typeorm_1.Like)(`%${params}%`) }
            ],
            order: {
                id: "DESC",
            },
        });
        return results;
    }
    catch (_e) {
        throw new Error("Fetch failed!");
    }
});
exports.searchService = searchService;
const getCellsService = (cell) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield artsRepository.find({
            where: {
                cell: cell
            }
        });
        return results;
    }
    catch (_f) {
        throw new Error("Error getting free positions in the selected cell");
    }
});
exports.getCellsService = getCellsService;
const deleteArtService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield artsRepository.delete(id);
        return results;
    }
    catch (_g) {
        throw new Error("Could not delete the entry!");
    }
});
exports.deleteArtService = deleteArtService;
const updateArtService = (title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedEntry = { title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell,
        position,
        by_user };
    try {
        const item = yield artsRepository.findOneBy({
            id: id
        });
        yield artsRepository.merge(item, updatedEntry);
        const results = yield artsRepository.save(item);
        return results;
    }
    catch (_h) {
        throw new Error("Could not update entry");
    }
});
exports.updateArtService = updateArtService;
const updateLocationService = (ids, formControlData) => __awaiter(void 0, void 0, void 0, function* () {
    const { storageLocation, cell, position } = formControlData;
    const promises = [];
    try {
        const images = yield artsRepository.findBy({
            id: (0, typeorm_1.In)([ids])
        });
        for (let image of images) {
            promises.push(yield artsRepository.save({
                id: image.id,
                storageLocation: storageLocation,
                cell: cell || '',
                position: position || 0
            }));
        }
        const result = yield Promise.all(promises);
        return result;
    }
    catch (_j) {
        throw new Error("Could not update locations!");
    }
});
exports.updateLocationService = updateLocationService;
const createCertificateService = (imageSrc, bio, artist, title, technique, dimensions, dataCallback, endCallback) => {
    const doc = new pdfkit_1.default({ size: 'letter', layout: 'landscape' });
    const fontsFolderPath = path_1.default.join(__dirname, '../../fonts/Raleway/static');
    //const fontsFolderSuperHosting = path.join(__dirname, '../fonts/Raleway/static');
    const ralewayStandardFont = path_1.default.join(fontsFolderPath, 'Raleway-Light.ttf');
    //layout
    const columnWidth = doc.page.width / 4; // Divide the page width into two equal columns
    const columnHeight = doc.page.height;
    const gutter = 100; // Adjust the spacing between the columns
    const startX = doc.page.margins.left;
    const startY = doc.page.margins.top;
    //layout
    doc.registerFont('CustomFont', ralewayStandardFont);
    doc.font('CustomFont');
    try {
        doc.image(imageSrc, 10, 30, { width: columnWidth, height: columnHeight / 3, fit: [30, 30] });
        doc.fontSize(12).text('СЕРТИФИКАТ ЗА', 50, 30, { width: columnWidth });
        doc.fontSize(12).text('АВТЕНТИЧНОСТ', 50, 50, { width: columnWidth });
        doc.fontSize(10).text(`АВТОР: ${artist}`, 50, 80, { width: columnWidth });
        doc.fontSize(10).text(`ТВОРБА: ${title}`, 50, 100, { width: columnWidth });
        doc.fontSize(10).text(`ТЕХНИКА: ${technique}`, 50, 120, { width: columnWidth });
        doc.fontSize(10).text(`РАЗМЕР: ${dimensions}см`, 50, 140, { width: columnWidth });
        doc.image(imageSrc, 50, 160, { width: columnWidth, height: columnHeight, fit: [200, Infinity] });
        doc.fontSize(6).text('Заключение: Произведението е оригинал', 50, 400, { width: columnWidth });
        doc.fontSize(6).text('Малка Художествена Галерия', 50, 420, { width: columnWidth });
        doc.fontSize(8).text(bio, startX + columnWidth + gutter, 30, { width: 320 });
        doc.on('data', dataCallback);
        doc.on('end', endCallback);
        doc.end();
    }
    catch (_a) {
        throw new Error("Could not create certificate!");
    }
};
exports.createCertificateService = createCertificateService;
