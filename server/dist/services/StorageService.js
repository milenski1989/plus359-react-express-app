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
const typeorm_1 = require("typeorm");
const database_1 = require("../database");
const Artworks_1 = require("../entities/Artworks");
const Storages_1 = require("../entities/Storages");
const Cells_1 = require("../entities/Cells");
const Positions_1 = require("../entities/Positions");
const artsRepository = database_1.dbConnection.getRepository(Artworks_1.Artworks);
const cellsRepository = database_1.dbConnection.getRepository(Cells_1.Cells);
const positionsRepository = database_1.dbConnection.getRepository(Positions_1.Positions);
const storagesRepository = database_1.dbConnection.getRepository(Storages_1.Storages);
class StorageService {
    constructor() { }
    static getInstance() {
        if (!StorageService.storageService) {
            StorageService.storageService = new StorageService();
        }
        return StorageService.storageService;
    }
    getAllStorages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield storagesRepository.find({
                    relations: ["cells", "cells.positions"],
                });
                return results;
            }
            catch (_a) {
                throw new Error("Error getting free positions in the selected cell");
            }
        });
    }
    getAllStoragesWithNoEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield database_1.dbConnection
                    .getRepository(Storages_1.Storages)
                    .createQueryBuilder("storage")
                    .leftJoinAndSelect("storage.artworks", "artwork")
                    .where("artwork.id IS NULL")
                    .getMany();
                return results;
            }
            catch (_a) {
                throw new Error("Error getting storages with no entries!");
            }
        });
    }
    getOneByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield storagesRepository.findOne({
                    where: {
                        name: name,
                    },
                });
                return result;
            }
            catch (_a) {
                throw new Error("Error getting free positions in the selected cell");
            }
        });
    }
    getSparePositions(cell, storage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundCell = yield cellsRepository.findOne({ where: { name: cell } });
                const foundStorage = yield storagesRepository.findOne({ where: { name: storage } });
                const cells = yield cellsRepository.findOne({
                    where: { id: foundCell.id, storage_id: foundStorage.id },
                    relations: ['artworks']
                });
                const positions = yield positionsRepository.find({
                    where: { cell_id: foundCell.id, cell: { storage_id: foundStorage.id } }
                });
                const freePositions = positions.filter(position => cells.artworks.every(artwork => position.id !== artwork.position_id));
                const response = freePositions.map(freePosition => freePosition.name);
                return response;
            }
            catch (_a) {
                throw new Error("Error getting spare positions from the selected cell!");
            }
        });
    }
    updateLocation(ids, formControlData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageLocation, cell, position } = formControlData;
            console.log(formControlData);
            const promises = [];
            try {
                const images = yield artsRepository.findBy({
                    id: (0, typeorm_1.In)([ids]),
                });
                const foundStorage = yield this.getOneByName(storageLocation);
                const foundCell = yield cellsRepository.findOne({
                    where: { name: cell, storage_id: foundStorage.id }
                });
                console.log('foundCell', foundCell);
                const foundPosition = yield positionsRepository.findOne({
                    where: { cell_id: foundCell.id, cell: { storage_id: foundStorage.id }, name: position.toString() }
                });
                if (foundStorage) {
                    for (let image of images) {
                        promises.push(yield artsRepository.save({
                            id: image.id,
                            storageLocation: storageLocation,
                            cell: cell || "",
                            position: position || 0,
                            storage_id: foundStorage.id,
                            cell_id: foundCell ? foundCell.id : 0,
                            position_id: foundPosition ? foundPosition.id : 0
                        }));
                    }
                    const result = yield Promise.all(promises);
                    return result;
                }
            }
            catch (_a) {
                throw new Error("Could not update locations!");
            }
        });
    }
    saveStorage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundStorage = yield this.getOneByName(name);
                console.log(foundStorage);
                if (foundStorage)
                    throw new Error();
                else {
                    const storage = yield database_1.dbConnection.query(`
        INSERT INTO storages (name)
        VALUES ('${name}')
        `);
                    const [storageId] = yield database_1.dbConnection.query(`
        SELECT MAX(id) from storages;
        `);
                    yield database_1.dbConnection.query(`
        INSERT INTO cells (name, storage_id)
        VALUES ('${name}1', ${storageId['MAX(id)']})
        `);
                    const [cellId] = yield database_1.dbConnection.query(`
        SELECT MAX(id) from cells;
        `);
                    yield database_1.dbConnection.query(`
        INSERT INTO positions (name, cell_id)
        SELECT t.n, ${cellId['MAX(id)']}
        FROM (
          SELECT 1 AS n UNION ALL
          SELECT 2 UNION ALL
          SELECT 3 UNION ALL
          SELECT 4 UNION ALL
          SELECT 5 UNION ALL
          SELECT 6 UNION ALL
          SELECT 7 UNION ALL
          SELECT 8 UNION ALL
          SELECT 9 UNION ALL
          SELECT 10 UNION ALL
          SELECT 11 UNION ALL
          SELECT 12 UNION ALL
          SELECT 13 UNION ALL
          SELECT 14 UNION ALL
          SELECT 15 UNION ALL
          SELECT 16 UNION ALL
          SELECT 17 UNION ALL
          SELECT 18 UNION ALL
          SELECT 19 UNION ALL
          SELECT 20 UNION ALL
          SELECT 21 UNION ALL
          SELECT 22 UNION ALL
          SELECT 23 UNION ALL
          SELECT 24 UNION ALL
          SELECT 25 UNION ALL
          SELECT 26 UNION ALL
          SELECT 27 UNION ALL
          SELECT 28 UNION ALL
          SELECT 29 UNION ALL
          SELECT 30 UNION ALL
          SELECT 31 UNION ALL
          SELECT 32 UNION ALL
          SELECT 33 UNION ALL
          SELECT 34 UNION ALL
          SELECT 35 UNION ALL
          SELECT 36 UNION ALL
          SELECT 37 UNION ALL
          SELECT 38 UNION ALL
          SELECT 39 UNION ALL
          SELECT 40 UNION ALL
          SELECT 41 UNION ALL
          SELECT 42 UNION ALL
          SELECT 43 UNION ALL
          SELECT 44 UNION ALL
          SELECT 45 UNION ALL
          SELECT 46 UNION ALL
          SELECT 47 UNION ALL
          SELECT 48 UNION ALL
          SELECT 49 UNION ALL
          SELECT 50 UNION ALL
          SELECT 51 UNION ALL
          SELECT 52 UNION ALL
          SELECT 53 UNION ALL
          SELECT 54 UNION ALL
          SELECT 55 UNION ALL
          SELECT 56 UNION ALL
          SELECT 57 UNION ALL
          SELECT 58 UNION ALL
          SELECT 59 UNION ALL
          SELECT 60 UNION ALL
          SELECT 61 UNION ALL
          SELECT 62 UNION ALL
          SELECT 63 UNION ALL
          SELECT 64 UNION ALL
          SELECT 65 UNION ALL
          SELECT 66 UNION ALL
          SELECT 67 UNION ALL
          SELECT 68 UNION ALL
          SELECT 69 UNION ALL
          SELECT 70 UNION ALL
          SELECT 71 UNION ALL
          SELECT 72 UNION ALL
          SELECT 73 UNION ALL
          SELECT 74 UNION ALL
          SELECT 75 UNION ALL
          SELECT 76 UNION ALL
          SELECT 77 UNION ALL
          SELECT 78 UNION ALL
          SELECT 79 UNION ALL
          SELECT 80 UNION ALL
          SELECT 81 UNION ALL
          SELECT 82 UNION ALL
          SELECT 83 UNION ALL
          SELECT 84 UNION ALL
          SELECT 85 UNION ALL
          SELECT 86 UNION ALL
          SELECT 87 UNION ALL
          SELECT 88 UNION ALL
          SELECT 89 UNION ALL
          SELECT 90 UNION ALL
          SELECT 91 UNION ALL
          SELECT 92 UNION ALL
          SELECT 93 UNION ALL
          SELECT 94 UNION ALL
          SELECT 95 UNION ALL
          SELECT 96 UNION ALL
          SELECT 97 UNION ALL
          SELECT 98 UNION ALL
          SELECT 99 UNION ALL
          SELECT 100
        ) AS t;
        `);
                    return storage;
                }
            }
            catch (_a) {
                throw new Error("Storage with this name already exists!");
            }
        });
    }
    deleteStorage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundStorage = yield this.getOneByName(name);
                if (foundStorage) {
                    const cell = yield cellsRepository.findOne({ where: { storage_id: foundStorage.id } });
                    yield positionsRepository.delete({ cell_id: cell.id });
                    yield cellsRepository.delete({ id: cell.id, storage_id: foundStorage.id });
                    yield storagesRepository.delete(foundStorage.id);
                }
                else {
                    throw new Error('No storage with this name was found!');
                }
            }
            catch (_a) {
                throw new Error('Delete storage failed!');
            }
        });
    }
    getAllCellsFromCurrentStorage(currentStorage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cells;
                if (currentStorage === 'All') {
                    cells = yield cellsRepository.find();
                }
                else {
                    const foundStorage = yield storagesRepository.findOne({
                        where: { name: currentStorage }
                    });
                    cells = yield cellsRepository.find({
                        where: {
                            storage_id: foundStorage.id
                        }
                    });
                }
                const cellsNames = cells.map(cell => cell.name);
                return cellsNames;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = StorageService;
