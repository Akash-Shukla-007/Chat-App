"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var tokenGenerator = function (email, id) {
    var secretKey = process.env.JWT_SECRET;
    var token = jsonwebtoken_1.default.sign({ email: email, id: id }, secretKey);
    return token;
};
exports.default = tokenGenerator;
