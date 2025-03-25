import express from "express";
import UserModel from "../models/User.js";

import {
  responseErrorCreator,
  responseSuccessCreator,
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/index.js";

import AWSIamUserObj from "../services/AWSUser.js";

class User {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
  }

  getRoutes() {
    /**
     * Get User Profile Information
     */
    this.router.get("/", async (req, res) => {});
  }

  postRoutes() {
    /**
     * @swagger /user/register:
     *  post:
     *     summary: Creates a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: marven123
     *               email:
     *                 type: string
     *                 example: marven@example.com
     *               password:
     *                 type: string
     *                 example: StrongPassword123
     *     responses:
     *       200:
     *         description: User registered successfully
     *       400:
     *         description: Missing or invalid input
     */
    this.router.post("/register", async (req, res) => {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return responseErrorCreator(
          req,
          res,
          400,
          "Please enter all the details"
        );
      }

      const user = await UserModel.findOne({ username });
      if (user) {
        return responseErrorCreator(
          req,
          res,
          400,
          "User with username already exist"
        );
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await UserModel.create({
        email: email,
        username: username,
        password: hashedPassword,
      });
      await AWSIamUserObj.createUser(username);
      return responseSuccessCreator(req, res, 200, "User registered", {
        email,
        username,
      });
    });

    /**
     * @swagger /user/login:
     *   post:
     *     summary: Logs in an existing user and returns a JWT token
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: marven123
     *               password:
     *                 type: string
     *                 example: StrongPassword123
     *     responses:
     *       200:
     *         description: Login successful
     *         headers:
     *           x-access-token:
     *             schema:
     *               type: string
     *             description: JWT access token
     *       400:
     *         description: Missing input fields
     *       403:
     *         description: Incorrect password
     *       404:
     *         description: User not found
     */
    this.router.post("/login", async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return responseErrorCreator(
          req,
          res,
          400,
          "Please enter all the details"
        );
      }

      const user = await UserModel.findOne({ username });
      if (!user) {
        return responseErrorCreator(req, res, 404, "User not found");
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return responseErrorCreator(req, res, 403, "Incorrect password");
      }

      const newAccessKey = await AWSIamUserObj.createAccessKey(
        user.username,
        user?.accessKey
      );

      // Fetch AccessKeyId and SecretAccessKey
      const newAccessKeyId = newAccessKey.AccessKey.AccessKeyId
      const newSecretAccessKey = newAccessKey.AccessKey.SecretAccessKey;

      // Update new AccessKeyId to UserModel
      await UserModel.findByIdAndUpdate(user._id, {
        accessKey: newAccessKeyId,
      });

      // Prepare Auth Token with UserInformation and SecretAccessKey
      const token = generateToken(
        {
          _id: user._id,
          email: user.email,
          username: user.username,
          secretKey: newSecretAccessKey,
        },
        "4h"
      );

      res.set("Authorization", `Bearer ${token}`);

      return responseSuccessCreator(req, res, 200, "Login Succesful", {
        email: user.email,
        username,
        secretKey: newSecretAccessKey,
      });
    });
  }
}

export default new User().router;
