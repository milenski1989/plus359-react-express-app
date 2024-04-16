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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const Artworks_1 = require("../entities/Artworks");
const S3Service_1 = require("./S3Service");
const s3Client = new S3Service_1.S3Service();
const artsRepository = database_1.dbConnection.getRepository(Artworks_1.Artworks);
class ArtworksService {
    constructor() { }
    static getInstance() {
        if (!ArtworksService.authenticationService) {
            ArtworksService.authenticationService = new ArtworksService();
        }
        return ArtworksService.authenticationService;
    }
    getOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield artsRepository.findOne({
                    where: {
                        id: id,
                    },
                });
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield artsRepository.find();
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    getAllByCellFromCurrentStorage(currentStorage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield artsRepository.find({
                    where: {
                        storageLocation: currentStorage,
                    },
                });
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    getAllByArtistAndStorage(artist, storage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (storage === "All") {
                    return yield artsRepository.find({
                        where: { artist: artist },
                    });
                }
                else {
                    return yield artsRepository.find({
                        where: { artist: artist, storageLocation: storage },
                    });
                }
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    getAllByCellInStorage(cell) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield artsRepository.find({
                    where: { cell: cell },
                });
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    getAllByStorage(name, page, count, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name === "All") {
                    const [arts, artsCount] = yield artsRepository.findAndCount({
                        order: { [sortField]: sortOrder.toUpperCase() },
                        take: parseInt(count),
                        skip: parseInt(count) * parseInt(page) - parseInt(count),
                    });
                    return [arts, artsCount];
                }
                else {
                    const [arts, artsCount] = yield artsRepository.findAndCount({
                        order: { [sortField]: sortOrder.toUpperCase() },
                        where: { storageLocation: name },
                        take: parseInt(count),
                        skip: parseInt(count) * parseInt(page) - parseInt(count),
                    });
                    return [arts, artsCount];
                }
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    saveFileIntoDatabase(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, image_url, image_key, download_url, download_key, by_user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newArtwork = artsRepository.create({
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
                    by_user,
                });
                const savedArtwork = yield artsRepository.save(newArtwork);
                return savedArtwork;
            }
            catch (error) {
                throw new Error("Error saving artwork into the database!");
            }
        });
    }
    updateImageData(old_download_key, old_image_key, id, image_url, image_key, download_url, download_key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield s3Client.deleteFile(old_download_key, old_image_key);
                yield database_1.dbConnection
                    .createQueryBuilder()
                    .update(Artworks_1.Artworks)
                    .set({ image_url, image_key, download_url, download_key })
                    .where("id = :id", { id: id })
                    .execute();
            }
            catch (_a) {
                throw new Error("Error updating image data in database!");
            }
        });
    }
    filterAllEntries(keywords = [], sortField, sortOrder, selectedArtist, selectedCell) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            let results;
            let whereConditions;
            let additionalCondition;
            let whereParams;
            if (selectedArtist && !selectedCell && !keywords.length) {
                additionalCondition = `artworks.artist = '${selectedArtist}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else if (selectedArtist && selectedCell && !keywords.length) {
                additionalCondition = `artworks.artist = '${selectedArtist}' AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else if (!selectedArtist && !selectedCell && keywords.length) {
                whereConditions = keywords
                    .map((keyword) => `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`)
                    .join(" AND ");
                whereParams = keywords.map((keyword) => `%${keyword}%`);
                additionalCondition = `AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else if (!selectedArtist && selectedCell && keywords.length) {
                whereConditions = keywords
                    .map((keyword) => `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation) LIKE ?)`)
                    .join(" AND ");
                whereParams = keywords.map((keyword) => `%${keyword}%`);
                additionalCondition = `AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else if (!selectedArtist && selectedCell && !keywords.length) {
                additionalCondition = `artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else if (selectedArtist && !selectedCell && keywords.length) {
                whereConditions = keywords
                    .map((keyword) => `(CONCAT(artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`)
                    .join(" AND ");
                whereParams = keywords.map((keyword) => `%${keyword}%`);
                additionalCondition = `AND artworks.artist = '${selectedArtist}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            else {
                whereConditions = keywords
                    .map((keyword) => `(CONCAT(artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation) LIKE ?)`)
                    .join(" AND ");
                whereParams = keywords.map((keyword) => `%${keyword}%`);
                additionalCondition = `AND artworks.artist = '${selectedArtist}' AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`;
            }
            if (whereConditions) {
                query = `
      SELECT *
      FROM artworks
      WHERE ${whereConditions} ${additionalCondition}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
    `;
                console.log('QUERY', query);
            }
            else {
                query = `
      SELECT *
      FROM artworks
      WHERE ${additionalCondition}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
    `;
            }
            if (whereParams) {
                const finalParams = [...whereParams];
                results = yield database_1.dbConnection.query(query, finalParams);
            }
            else {
                results = yield database_1.dbConnection.query(query);
            }
            return results;
        });
    }
    deleteOne(originalFilename, filename, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield s3Client.deleteFile(originalFilename, filename);
            }
            catch (_a) {
                throw new Error("Could not delete the entry!");
            }
            try {
                const results = yield artsRepository.delete(id);
                return results;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    updateOne(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedEntry = {
                title,
                artist,
                technique,
                dimensions,
                price,
                notes,
                storageLocation,
                cell,
                position,
                by_user,
            };
            try {
                const item = yield artsRepository.findOneBy({
                    id: id,
                });
                artsRepository.merge(item, updatedEntry);
                const results = yield artsRepository.save(item);
                return results;
            }
            catch (_a) {
                throw new Error("Could not update entry");
            }
        });
    }
}
exports.default = ArtworksService;
