"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = require("../Middleware/authMiddleware");
var ChatControllers_1 = require("../Controllers/ChatControllers");
var router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, ChatControllers_1.accessChat);
router.get("/", authMiddleware_1.authMiddleware, ChatControllers_1.fetchChat);
router.post("/group", authMiddleware_1.authMiddleware, ChatControllers_1.createGroupChat);
router.put("/rename", authMiddleware_1.authMiddleware, ChatControllers_1.renameGroup);
router.put("/addtogroup", authMiddleware_1.authMiddleware, ChatControllers_1.addToGroup);
router.put("/removefromgroup", authMiddleware_1.authMiddleware, ChatControllers_1.removeFromGroup);
module.exports = router;
