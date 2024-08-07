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
const Artists_1 = require("../entities/Artists");
const artistsRepository = database_1.dbConnection.getRepository(Artists_1.Artists);
class ArtistsService {
    constructor() { }
    static getInstance() {
        if (!ArtistsService.artistsService) {
            ArtistsService.artistsService = new ArtistsService();
        }
        return ArtistsService.artistsService;
    }
    getOneByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const artist = yield artistsRepository.findOne({
                    where: {
                        artist: name,
                    },
                });
                return artist;
            }
            catch (_a) {
                throw new Error("No bio for this artist found!");
            }
        });
    }
}
exports.default = ArtistsService;
