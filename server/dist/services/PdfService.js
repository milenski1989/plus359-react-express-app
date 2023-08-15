"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
class PdfService {
    constructor() { }
    static getInstance() {
        if (!PdfService.pdfService) {
            PdfService.pdfService = new PdfService();
        }
        return PdfService.pdfService;
    }
    createCertificate(imageSrc, bio, artist, title, technique, dimensions, dataCallback, endCallback) {
        const doc = new pdfkit_1.default({ size: 'letter', layout: 'landscape' });
        const fontsFolderPath = path_1.default.join(__dirname, '../../fonts/Raleway/static');
        //const fontsFolderSuperHosting = path.join(__dirname, '../fonts/Raleway/static');
        const ralewayStandardFont = path_1.default.join(fontsFolderPath, 'Raleway-Light.ttf');
        //layout
        const columnWidth = doc.page.width / 4; // Divide the page width into two equal columns
        const columnHeight = doc.page.height;
        const gutter = 100; // Adjust the spacing between the columns
        const startX = doc.page.margins.left;
        const startY = doc.page.margins.top;
        //layout
        doc.registerFont('CustomFont', ralewayStandardFont);
        doc.font('CustomFont');
        try {
            doc.image(imageSrc, 10, 30, { width: columnWidth, height: columnHeight / 3, fit: [30, 30] });
            doc.fontSize(12).text('СЕРТИФИКАТ ЗА', 50, 30, { width: columnWidth });
            doc.fontSize(12).text('АВТЕНТИЧНОСТ', 50, 50, { width: columnWidth });
            doc.fontSize(10).text(`АВТОР: ${artist}`, 50, 80, { width: columnWidth });
            doc.fontSize(10).text(`ТВОРБА: ${title}`, 50, 100, { width: columnWidth });
            doc.fontSize(10).text(`ТЕХНИКА: ${technique}`, 50, 120, { width: columnWidth });
            doc.fontSize(10).text(`РАЗМЕР: ${dimensions}см`, 50, 140, { width: columnWidth });
            doc.image(imageSrc, 50, 160, { width: columnWidth, height: columnHeight, fit: [200, Infinity] });
            doc.fontSize(6).text('Заключение: Произведението е оригинал', 50, 400, { width: columnWidth });
            doc.fontSize(6).text('Малка Художествена Галерия', 50, 420, { width: columnWidth });
            doc.fontSize(8).text(bio, startX + columnWidth + gutter, 30, { width: 320 });
            doc.on('data', dataCallback);
            doc.on('end', endCallback);
            doc.end();
        }
        catch (_a) {
            throw new Error("Could not create certificate!");
        }
    }
    ;
}
exports.default = PdfService;
