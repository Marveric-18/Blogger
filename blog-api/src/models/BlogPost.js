import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
    user: { 
        type:  mongoose.ObjectId, 
        ref: 'User',
        required: true 
    },
    imageUrl: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
  }, { timestamps: true });
  
  const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

  export default BlogPost;