import express from "express";
const router = express.Router();

import { allUsers, logIn, signUp } from "../Controllers/AuthController";
import { authMiddleware } from "../Middleware/authMiddleware";

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/", authMiddleware, allUsers);

module.exports = router;
