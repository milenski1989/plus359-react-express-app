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
exports.Artists_Bios = void 0;
const typeorm_1 = require("typeorm");
const Artists_1 = require("./Artists");
let Artists_Bios = class Artists_Bios extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Artists_Bios.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 10000 }),
    __metadata("design:type", String)
], Artists_Bios.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Artists_Bios.prototype, "artist_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Artists_1.Artists),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Artists_1.Artists)
], Artists_Bios.prototype, "artist", void 0);
Artists_Bios = __decorate([
    (0, typeorm_1.Entity)()
], Artists_Bios);
exports.Artists_Bios = Artists_Bios;
