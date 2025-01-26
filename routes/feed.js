import { Router } from "express";
import { body } from "express-validator";

import { getPosts, createPost, getPost, updatePost, deletePost } from "../controllers/feed.js";

import isAuth from "../middleware/is-auth.js";

const router = Router();

router.get("/posts", isAuth, getPosts);

router.post(
  "/create",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", isAuth, getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

export default router;
