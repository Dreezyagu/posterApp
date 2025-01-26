import { Router } from "express";
import { body } from "express-validator";

import User from "../models/user.js";

const router = Router();

import { signup, login } from "../controllers/auth.js";

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email already exist");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
    body("name").trim().notEmpty(),
  ],
  signup
);

router.post("/login", login);

export default router;
