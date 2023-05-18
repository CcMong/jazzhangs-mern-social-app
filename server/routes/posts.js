import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/", verifyToken, getFeedPosts); // This will take all posts and render them. In real projects, there will be algorithms or AI that will curate the posts and choose relevant ones, etc
router.get("/:userId/posts", verifyToken, getUserPosts); // Here, we want to grab the posts for a particular user, as opposed to previous ones where it will be all our posts

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

export default router;


