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
exports.Positions = void 0;
const typeorm_1 = require("typeorm");
const Cells_1 = require("./Cells");
const Artworks_1 = require("./Artworks");
let Positions = class Positions extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Positions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Positions.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Positions.prototype, "cell_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cells_1.Cells, cell => cell.positions),
    (0, typeorm_1.JoinColumn)({ name: "cell_id" }),
    __metadata("design:type", Cells_1.Cells)
], Positions.prototype, "cell", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Artworks_1.Artworks, artwork => artwork.position),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Artworks_1.Artworks)
], Positions.prototype, "artwork", void 0);
Positions = __decorate([
    (0, typeorm_1.Entity)()
], Positions);
exports.Positions = Positions;
