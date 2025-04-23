import express from "express";
import { createCourse, getCourses, getCourseById,  deleteCourse, addChapter, addLecture, getAllCourses, enrollCourse, getEnrollments, markLectureComplete, markCourseComplete, getInstructorEnrollments,  } from "../controller/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create-course", protect, upload.fields([{ name: "thumbnail" }, { name: "video" }]), createCourse);
router.get("/get-courses", protect, getCourses);
router.get("/get-course", getAllCourses);
router.get("/single-course/:id", getCourseById);
 router.delete("/delete-course/:id", protect, deleteCourse);

// New routes for chapters and lectures
router.post("/course/:courseId/chapter", protect, addChapter);
router.post("/course/:courseId/chapter/:chapterId/lecture", protect, addLecture);

router.post("/enroll/:courseId", protect, enrollCourse);
router.get('/enrollments', protect, getEnrollments);
router.post('/mark-complete/:courseId', protect, markLectureComplete); 
router.post('/mark-course-complete/:courseId', protect, markCourseComplete); 
router.get('/instructor-enrollments', protect, getInstructorEnrollments);


export default router;