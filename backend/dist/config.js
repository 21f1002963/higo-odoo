"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/higo';
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.NODE_ENV = process.env.NODE_ENV || 'development';
