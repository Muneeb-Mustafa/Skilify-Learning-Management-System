import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, 
    },
    messages: {
      type: String, 
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student", // Default role for new users
    }, 
    resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  bio: { type: String, default: "" }, // New field for user bio
    profilePicture: { type: String, default: "" }, // URL to profile picture
    socialLinks: { type: Map, of: String }, // Store social media links (e.g., GitHub, LinkedIn),
  }, 
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;

 