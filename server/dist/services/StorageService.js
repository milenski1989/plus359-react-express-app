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
const artsRepository = database_1.dbConnection.getRepository(Artworks_1.Artworks);
class StorageService {
    constructor() { }
    static getInstance() {
        if (!StorageService.storageService) {
            StorageService.storageService = new StorageService();
        }
        return StorageService.storageService;
    }
    getFreeCells(cell) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield artsRepository.find({
                    where: {
                        cell: cell
                    }
                });
                return results;
            }
            catch (_a) {
                throw new Error("Error getting free positions in the selected cell");
            }
        });
    }
    ;
    updateLocation(ids, formControlData) {
        return __awaiter(this, void 0, void 0, function* () {
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
            catch (_a) {
                throw new Error("Could not update locations!");
            }
        });
    }
}
exports.default = StorageService;
