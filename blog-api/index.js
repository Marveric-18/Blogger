import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoDbConnect from "./src/database/index.js";
import { swaggerUi, specs } from "./swagger.js";

import Authentication from "./src/middleware/index.js";
import UserRouter from "./src/api/user.js";
import BlogPostRouter from "./src/api/blogs.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  cors({
    origin: true, // or true for all origins
    exposedHeaders: ["Authorization"], // 👈 this is what you need
  })
);
app.options("*", cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (req, res) => {
  res.send("Health Check").status(200);
});

app.use("/user", UserRouter);
app.use("/blog", Authentication, BlogPostRouter);

app.listen(process.env.PORT, () => {
  mongoDbConnect();
  console.log(`Running on PORT ${process.env.PORT}`);
});
