import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware";
import { allMessages, sendMessage } from "../Controllers/MessagesController";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, allMessages);

module.exports = router;
