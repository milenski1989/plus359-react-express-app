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
    getAllByStorage(name, page, count, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name === 'All') {
                    const [arts, artsCount] = yield artsRepository.findAndCount({
                        order: { [sortField]: sortOrder.toUpperCase() },
                        take: parseInt(count),
                        skip: (parseInt(count) * parseInt(page)) - parseInt(count)
                    });
                    return [arts, artsCount];
                }
                else {
                    const [arts, artsCount] = yield artsRepository.findAndCount({
                        order: { [sortField]: sortOrder.toUpperCase() },
                        where: { storageLocation: name },
                        take: parseInt(count),
                        skip: (parseInt(count) * parseInt(page)) - parseInt(count)
                    });
                    return [arts, artsCount];
                }
            }
            catch (_a) {
                throw new Error("Fetch failed!");
            }
        });
    }
    ;
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
                throw new Error("Error saving artwork into the database");
            }
        });
    }
    searchByKeywords(keywords, page, count, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereConditions = keywords.map(keyword => `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`).join(' AND ');
            const whereParams = keywords.map(keyword => `%${keyword}%`);
            const query = `
            SELECT *
            FROM artworks
            WHERE ${whereConditions}
            ORDER BY ${sortField} ${sortOrder.toUpperCase()}
            LIMIT ? OFFSET ?
          `;
            const countQuery = `
            SELECT COUNT(*) AS total
            FROM artworks
            WHERE ${whereConditions}
          `;
            const paginationParams = [parseInt(count), (parseInt(page) - 1) * parseInt(count)];
            const finalParams = [...whereParams, ...paginationParams];
            const countResult = yield database_1.dbConnection.query(countQuery, whereParams);
            const total = countResult[0].total;
            const results = yield database_1.dbConnection.query(query, finalParams);
            return [results, total];
        });
    }
    deleteFileFromS3AndDB(originalFilename, filename, id) {
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
    ;
    updateArtwork(title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user, id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            catch (_a) {
                throw new Error("Could not update entry");
            }
        });
    }
    ;
}
exports.default = ArtworksService;
