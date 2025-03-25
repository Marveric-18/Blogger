import mongoose from "mongoose";

const mongoDbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL , {
      retryWrites: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

export default mongoDbConnect;
