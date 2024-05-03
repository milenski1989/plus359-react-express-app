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
exports.Cells = void 0;
const typeorm_1 = require("typeorm");
const Storages_1 = require("./Storages");
const Positions_1 = require("./Positions");
const Artworks_1 = require("./Artworks");
let Cells = class Cells extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cells.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cells.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Cells.prototype, "storage_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Storages_1.Storages, storage => storage.cells),
    (0, typeorm_1.JoinColumn)({ name: "storage_id" }),
    __metadata("design:type", Storages_1.Storages)
], Cells.prototype, "storage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Positions_1.Positions, position => position.cell),
    __metadata("design:type", Array)
], Cells.prototype, "positions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Artworks_1.Artworks, artwork => artwork.cell_t),
    __metadata("design:type", Array)
], Cells.prototype, "artworks", void 0);
Cells = __decorate([
    (0, typeorm_1.Entity)()
], Cells);
exports.Cells = Cells;
