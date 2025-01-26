import { validationResult } from "express-validator";
import pkg from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const { hash, compare } = pkg;
const { sign } = jwt;

export async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const hashedPw = await hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save();

    res.status(201).json({ message: "User created!", _id: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    const error = Error("A user with this email could not be found.");
    error.statusCode = 401;
   next(error)
  }
  try {

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      next(err)
    }
    const token = sign(
      {
        email: user.email,
        _id: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, _id: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getUserStatus(req, res, next) {
  try {
    const user = await User.findById(req._id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const newStatus = req.body.status;
    const user = await User.findById(req._id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    const result = await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
