"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3Client = new aws_sdk_1.default.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
    }
});
exports.default = s3Client;
