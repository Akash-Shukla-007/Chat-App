"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var AuthController_1 = require("../Controllers/AuthController");
var authMiddleware_1 = require("../Middleware/authMiddleware");
router.post("/signup", AuthController_1.signUp);
router.post("/login", AuthController_1.logIn);
router.get("/", authMiddleware_1.authMiddleware, AuthController_1.allUsers);
module.exports = router;
