"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = require("../Middleware/authMiddleware");
var MessagesController_1 = require("../Controllers/MessagesController");
var router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, MessagesController_1.sendMessage);
router.get("/:chatId", authMiddleware_1.authMiddleware, MessagesController_1.allMessages);
module.exports = router;
