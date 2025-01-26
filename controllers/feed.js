import { unlink } from "fs";
import { join } from "path";

import { validationResult } from "express-validator";

import Post from "../models/post.js";
import User from "../models/user.js";

// Fetching all posts
export async function getPosts(req, res, next) {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

// Creating a new post
export async function createPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  try {
    const user = await User.findById(req._id);
    if (!user) {
      const error = Error("Unauthenticated.");
      error.statusCode = 401;
     next(error)
    }
    const imageUrl = "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg";
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req._id,
    });
    const result = await post.save();
    user.posts.push(post);
    const result2 = await user.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


// Fetching a single post
export async function getPost(req, res, next) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


// Updating an existing post
export async function updatePost(req, res, next) {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;


  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req._id) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
 
    post.title = title;
    post.content = content;
    const result = await post.save();
    res.status(200).json({ message: "Post updated!", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


// Deleting an existing post
export async function deletePost(req, res, next) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req._id) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    const result = await Post.findByIdAndDelete(postId);
    const user = await User.findById(req._id);
    user.posts.pull(postId);
    const result2 = user.save();
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

 
