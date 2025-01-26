import express from "express";
import { connect } from "mongoose";

import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";

import bodyParser from "body-parser";

const app = express();
const MONGODB_URI =
  "mongodb+srv://ifeanyi-driver:kTssAnhPr5MnJeG1@demo-cluster.d84qr.mongodb.net/posterApp?w=majority&appName=demo-cluster";

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE"
    ),
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    statusCode: status,
    message: message,
    data: data,
  });
});

try {
  await connect(MONGODB_URI);
  app.listen(8080);
} catch (err) {
  console.log(err);
}
