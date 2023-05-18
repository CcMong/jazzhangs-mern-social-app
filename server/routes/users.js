import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read routes, mainly for getting/grabbing info and nothing else

// READ
router.get("/:id", verifyToken, getUser); // From the /user route created in index.js, this will be /users/SOME ID. Query string
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;