import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, 
  url: { type: String, required: true }, 
  isPreview: { type: Boolean, default: false },  
});

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  curriculum: { type: String },
  outcomes: { type: String },
  category: { type: String },
  level: { type: String },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  video: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  chapters: [chapterSchema], // Array of chapters
});

const Course = mongoose.model("Course", courseSchema);
export default Course;