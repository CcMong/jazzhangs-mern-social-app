import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); // NB: This will be auth/login

export default router;
