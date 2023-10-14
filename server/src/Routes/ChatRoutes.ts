import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChat,
  removeFromGroup,
  renameGroup,
} from "../Controllers/ChatControllers";

const router = express.Router();

router.post("/", authMiddleware, accessChat);
router.get("/", authMiddleware, fetchChat);
router.post("/group", authMiddleware, createGroupChat);
router.put("/rename", authMiddleware, renameGroup);
router.put("/addtogroup", authMiddleware, addToGroup);
router.put("/removefromgroup", authMiddleware, removeFromGroup);

module.exports = router;
