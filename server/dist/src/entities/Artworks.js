"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artworks = void 0;
const typeorm_1 = require("typeorm");
const Storages_1 = require("./Storages");
const Cells_1 = require("./Cells");
const Positions_1 = require("./Positions");
let Artworks = class Artworks extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Artworks.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "artist", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "technique", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "dimensions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artworks.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "storageLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "cell", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artworks.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "image_key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "download_url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "download_key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Artworks.prototype, "by_user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artworks.prototype, "storage_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artworks.prototype, "cell_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artworks.prototype, "position_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Storages_1.Storages, storage => storage.artworks),
    (0, typeorm_1.JoinColumn)({ name: "storage_id" }),
    __metadata("design:type", Storages_1.Storages)
], Artworks.prototype, "storage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cells_1.Cells, cell => cell.artworks),
    (0, typeorm_1.JoinColumn)({ name: "cell_id" }),
    __metadata("design:type", Cells_1.Cells)
], Artworks.prototype, "cell_t", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Positions_1.Positions, position => position.artwork),
    (0, typeorm_1.JoinColumn)({ name: "position_id" }),
    __metadata("design:type", Positions_1.Positions)
], Artworks.prototype, "position_t", void 0);
Artworks = __decorate([
    (0, typeorm_1.Entity)()
], Artworks);
exports.Artworks = Artworks;
