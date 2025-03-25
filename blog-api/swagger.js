import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger Express API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional but nice for Swagger UI
        },
      },
      schemas: {
        BlogPost: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "65f24b1c2e9b34298f5d7abc",
            },
            user: {
              type: "string",
              example: "65f23a3e2e9b34298f5d7aaa",
            },
            imageUrl: {
              type: "string",
              nullable: true,
              example: "https://example.com/image.jpg",
            },
            title: {
              type: "string",
              example: "My First Blog Post",
            },
            body: {
              type: "string",
              example: "This is the body of the blog post.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-20T14:48:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-03-21T09:30:00.000Z",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/api/*.js"], // Path to your API routes
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
