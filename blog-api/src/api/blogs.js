import express from "express";

import {
  responseSuccessCreator,
  responseErrorCreator,
  paginateWithDateFallback,
} from "../utils/index.js";

import BlogPostModel from "../models/BlogPost.js";
import S3Bucket from "../services/S3Bucket.js";
import UserModel from "../models/User.js";

class Blogs {
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
     * @swagger
     * /blog/:
     *   get:
     *     summary: Get recent blog posts with dynamic date-based pagination
     *     tags: [Blog]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of blog posts per page
     *       - in: query
     *         name: mine
     *         schema:
     *           type: boolean
     *           default: false
     *         description: If true, fetch only the current user's posts
     *     responses:
     *       200:
     *         description: Successfully fetched paginated blog posts
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Successful
     *                 page:
     *                   type: integer
     *                   example: 1
     *                 limit:
     *                   type: integer
     *                   example: 10
     *                 fromDate:
     *                   type: string
     *                   format: date-time
     *                   example: "2024-01-20T00:00:00.000Z"
     *                 totalMatching:
     *                   type: integer
     *                   example: 23
     *                 totalCount:
     *                   type: integer
     *                   example: 50
     *                 totalPages:
     *                   type: integer
     *                   example: 3
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/BlogPost'
     *       401:
     *         description: Unauthorized - missing or invalid token
     *       500:
     *         description: Server error
     */

    this.router.get("/", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filter = {};

      if (req.query.mine === "true") {
        filter.user = req.user._id;
      }

      const result = await paginateWithDateFallback({
        BlogPostModel,
        model: BlogPostModel,
        page,
        limit,
        baseQuery: filter,
      });

      return responseSuccessCreator(req, res, 200, "Successful", {
        ...result,
      });
    });

    this.router.get("/signed-url", async (req, res) => {
      const { fileName, fileType } = req.query;
      if(!fileName || !fileType){
        return responseErrorCreator(req, res, 400, "Please provide filename and type", {
          description: "Filename or type is missing",
        }); 
      }
      const userInformation = req.user;

      const user = await UserModel.findById(userInformation._id);

      const s3Bucket = new S3Bucket(user.accessKey, userInformation.secretKey);

      const presignedUrl = await s3Bucket.getUploadSignedUrl(fileName, fileType);

      return responseSuccessCreator(req, res, 200, "Successful", { presignedUrl})
    });

    this.router.get("/signed-url/download", async (req, res) => {
      const { imageUrl } = req.query;
      if(!imageUrl){
        return responseErrorCreator(req, res, 400, "Please provide imageUrl", {
          description: "ImageUrl is missing",
        }); 
      }
      const userInformation = req.user;

      const user = await UserModel.findById(userInformation._id);

      const s3Bucket = new S3Bucket(user.accessKey, userInformation.secretKey);

      const presignedUrl = await s3Bucket.getDownloadSignedUrl(imageUrl);

      return responseSuccessCreator(req, res, 200, "Successful", { presignedUrl})
    });

    /**
     * @swagger
     * /blog/{id}:
     *   get:
     *     summary: Get a single blog post by ID
     *     tags: [Blog]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           example: 67de20570b105241e035336e
     *         description: MongoDB ObjectId of the blog post
     *     responses:
     *       200:
     *         description: Blog post fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Successful
     *                 data:
     *                   $ref: '#/components/schemas/BlogPost'
     *       404:
     *         description: Post not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Post nof found
     *                 data:
     *                   type: object
     *                   properties:
     *                     description:
     *                       type: string
     *                       example: Post with id not found
     *       401:
     *         description: Unauthorized - missing or invalid token
     */

    this.router.get("/:id", async (req, res) => {
      const { id } = req.params;
      const blogPost = await BlogPostModel.findById(id).lean();
      if (!blogPost) {
        return responseErrorCreator(req, res, 404, "Post nof found", {
          description: "Post with id not found",
        });
      }
      return responseSuccessCreator(req, res, 200, "Successful", {
        ...blogPost,
      });
    });

  }

  postRoutes() {
    /**
     * @swagger
     * /blog/:
     *   post:
     *     summary: Create a new blog post
     *     tags: [Blog]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - body
     *               - imageUrl
     *             properties:
     *               title:
     *                 type: string
     *                 example: "My New Blog"
     *               body:
     *                 type: string
     *                 example: "Blog post content"
     *               imageUrl:
     *                 type: string
     *                 example: "https://aws.s3.com/filename"
     *     responses:
     *       200:
     *         description: Blog post created
     */
    this.router.post("/", async (req, res) => {
      const { user } = req;
      const { imageUrl, title, body } = req.body;

      if (!title || !body) {
        return responseErrorCreator(req, res, 400, "Please enter post body");
      }

      // If image upload to S3 and get url

      const blogPost = await BlogPostModel.create({
        title,
        body,
        imageUrl: imageUrl,
        user: user._id.toString(),
      });

      if (!blogPost) {
        return responseErrorCreator(req, res, 500, "Something went wrong");
      }

      return responseSuccessCreator(
        req,
        res,
        200,
        "Blogpost created Succesfully",
        blogPost
      );
    });
  }
}

export default new Blogs().router;
