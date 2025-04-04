import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessKey: {
        type: String,
        required: false
    }
  }, { timestamps: true });
  
  const User = mongoose.model('User', UserSchema);

  export default User;