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
const database_1 = require("../database");
const Artists_1 = require("../entities/Artists");
const ArtistsBios_1 = require("../entities/ArtistsBios");
const ArtistsService_1 = __importDefault(require("./ArtistsService"));
const biosRepository = database_1.dbConnection.getRepository(ArtistsBios_1.ArtistsBios);
class BiosService {
    constructor() { }
    static getInstance() {
        if (!BiosService.biosService) {
            BiosService.biosService = new BiosService();
        }
        return BiosService.biosService;
    }
    getOne(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bio;
                const artist = yield ArtistsService_1.default.getInstance().getOneByName(name);
                if (!artist) {
                    throw new Error("Artist not found!");
                }
                else {
                    const bio = yield database_1.dbConnection
                        .createQueryBuilder()
                        .select("bio")
                        .from(ArtistsBios_1.ArtistsBios, "bio")
                        .leftJoin(Artists_1.Artists, "artist", "artist.id = bio.artistId")
                        .where("artistId = :id", { id: artist.id })
                        .getOne();
                    return bio;
                }
            }
            catch (_a) {
                throw new Error("No bio for this artist found!");
            }
        });
    }
    updateOne(id, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bioFound = yield biosRepository.findOneBy({
                    id: id,
                });
                biosRepository.merge(bioFound, Object.assign(Object.assign({}, bioFound), { bio: bio }));
                const results = yield biosRepository.save(bioFound);
                return results;
            }
            catch (error) {
                throw new Error("Could not update bio!");
            }
        });
    }
}
exports.default = BiosService;
