import { cloudinary } from "../config/cloudinary.js"; 
import Course from "../models/Course.js";   
import Enrollment from "../models/Enrollment.js";                  

export const createCourse = async (req, res) => {
  try {
    const { title, subtitle, description, curriculum, outcomes, category, level, price, chapters } = req.body;

    let thumbnailUrl = null;
    let videoUrl = null;

    if (req.files && req.files["thumbnail"]) {
      const thumbnailFile = req.files["thumbnail"][0];
      const result = await cloudinary.uploader.upload(thumbnailFile.path);
      thumbnailUrl = result.secure_url;
    }

    if (req.files && req.files["video"]) {
      const videoFile = req.files["video"][0];
      const result = await cloudinary.uploader.upload(videoFile.path, { resource_type: "video" });
      videoUrl = result.secure_url;
    }

    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required." });
    }

    // Parse chapters if provided (since it's sent as a JSON string in FormData)
    let parsedChapters = [];
    if (chapters) {
      try {
        parsedChapters = JSON.parse(chapters);
      } catch (error) {
        return res.status(400).json({ message: "Invalid chapters format" });
      }
    }

    const newCourse = new Course({
      title,
      subtitle,
      description,
      curriculum,
      outcomes,
      category,
      level,
      price,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      instructor: req.user.id,
      chapters: parsedChapters, // Include chapters in the new course
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error in createCourse:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a chapter to a course
export const addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the course instructor or an admin
    if (req.user.id !== course.instructor.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to add chapter to this course" });
    }

    course.chapters.push({ title });
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error in addChapter:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a lecture to a specific chapter
export const addLecture = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { title, duration, url, isPreview } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the course instructor or an admin
    if (req.user.id !== course.instructor.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to add lecture to this course" });
    }

    const chapter = course.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    chapter.lectures.push({ title, duration, url, isPreview });
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error in addLecture:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    let courses;
    if (req.user.role === "admin") {
      courses = await Course.find().populate("instructor", "name email");
    } else {
      courses = await Course.find({ instructor: req.user.id }).populate("instructor", "name email");
    } 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Get all courses - Updated to populate instructor details
export const getAllCourses = async (req, res) => {
  try {
      const courses = await Course.find().populate("instructor", "name email");
      res.json(courses);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const { title, subtitle, description, category, level, price, chapters } = req.body;
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the course instructor or an admin
    if (req.user.id !== course.instructor.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    let thumbnailUrl = course.thumbnail;
    let videoUrl = course.video;

    if (req.files && req.files["thumbnail"]) {
      const thumbnailFile = req.files["thumbnail"][0];
      const result = await cloudinary.uploader.upload(thumbnailFile.path);
      thumbnailUrl = result.secure_url;
    }

    if (req.files && req.files["video"]) {
      const videoFile = req.files["video"][0];
      const result = await cloudinary.uploader.upload(videoFile.path, { resource_type: "video" });
      videoUrl = result.secure_url;
    }

    // Update chapters if provided in the request
    if (chapters) {
      // Parse chapters if it's a JSON string (from FormData)
      let parsedChapters = chapters;
      if (typeof chapters === "string") {
        parsedChapters = JSON.parse(chapters);
      }

      // Ensure parsedChapters is an array before mapping
      if (Array.isArray(parsedChapters)) {
        course.chapters = parsedChapters.map(chapter => ({
          title: chapter.title,
          lectures: chapter.lectures.map(lecture => ({
            title: lecture.title,
            duration: lecture.duration,
            url: lecture.url,
            isPreview: lecture.isPreview || false // Default to false if not provided
          }))
        }));
      } else {
        return res.status(400).json({ message: "Chapters must be an array" });
      }
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, description, category, level, price, thumbnail: thumbnailUrl, video: videoUrl, chapters: course.chapters },
      { new: true }
    );

    res.status(200).json(course);
  } catch (error) {
    console.error("Error in updateCourse:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is the course instructor or an admin
    if (req.user.id !== course.instructor.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    res.status(500).json({ message: error.message });
  }
};

// New controller function

export const enrollCourse = async (req, res) => {
  const { email, paymentMethod, saveInformation } = req.body;
  const { courseId } = req.params;

  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    const course = await Course.findById(courseId).populate('instructor');  // Assuming course has instructor field

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const enrollment = new Enrollment({
      email,
      paymentMethod,
      saveInformation,
      user: userId,
      courseId,
      courseTitle: course.title,                    // Store course title
      instructorName: course.instructor?.name,      // Store instructor name
      instructorId: course.instructor?._id          // Store instructor ID
    });

    await enrollment.save();

    res.status(201).json({ message: "Enrolled successfully!" });
  } catch (err) {
    console.error('Error during course enrollment:', err);
    res.status(500).json({ message: "Failed to enroll in course.", error: err.message });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'courseId',
        select: 'title thumbnail category chapters lectures subtitle'
      });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollments.", error: err.message });
  }
};

export const markLectureComplete = async (req, res) => {
  const { courseId } = req.params;
  const { lectureId } = req.body;

  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const course = await Course.findById(courseId);
    const lectureExists = course.chapters.some(chapter =>
      chapter.lectures.some(lecture => lecture._id.toString() === lectureId)
    );

    if (!lectureExists) {
      return res.status(400).json({ message: 'Lecture not found in course' });
    }

    const isLectureCompleted = enrollment.completedLectures.some(
      completed => completed.lectureId.toString() === lectureId
    );

    if (!isLectureCompleted) {
      enrollment.completedLectures.push({ lectureId });
      await enrollment.save();
    }

    const totalLectures = course.chapters.reduce((total, chapter) => total + chapter.lectures.length, 0);
    const completedLecturesCount = enrollment.completedLectures.length;

    res.status(200).json({
      message: 'Lecture marked as complete',
      completedLectures: completedLecturesCount,
      totalLectures,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking lecture as complete', error: error.message });
  }
};

export const markCourseComplete = async (req, res) => {
  const { courseId } = req.params;
  const { lectureIds } = req.body;

  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const course = await Course.findById(courseId);
    const courseLectureIds = course.chapters
      .flatMap(chapter => chapter.lectures)
      .map(lecture => lecture._id.toString());

    const allValid = lectureIds.every(id => courseLectureIds.includes(id));
    if (!allValid) {
      return res.status(400).json({ message: 'Invalid lecture IDs provided' });
    }

    enrollment.completedLectures = lectureIds.map(lectureId => ({ lectureId }));
    await enrollment.save();

    const totalLectures = courseLectureIds.length;
    const completedLecturesCount = enrollment.completedLectures.length;

    res.status(200).json({
      message: 'Course marked as complete',
      completedLectures: completedLecturesCount,
      totalLectures,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking course as complete', error: error.message });
  }
};

// In courseController.js
export const getInstructorEnrollments = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Fetch enrollments where the instructorId matches the logged-in user
    const enrollments = await Enrollment.find({ instructorId })
      .populate({
        path: 'courseId',
        select: 'title thumbnail category chapters subtitle price',
      })
      .populate({
        path: 'user',
        select: 'name email', // Assuming your User model has name and email fields
      });

    // Group enrollments by course for easier frontend rendering
    const coursesWithEnrollments = {};
    enrollments.forEach((enrollment) => {
      const courseId = enrollment.courseId._id.toString();
      if (!coursesWithEnrollments[courseId]) {
        coursesWithEnrollments[courseId] = {
          _id: courseId,
          title: enrollment.courseId.title,
          subtitle: enrollment.courseId.subtitle,
          price: enrollment.courseId.price,
          thumbnail: enrollment.courseId.thumbnail,
          category: enrollment.courseId.category,
          chapters: enrollment.courseId.chapters,
          enrolledStudents: [],
          enrollmentCount: 0,
        };
      }
      coursesWithEnrollments[courseId].enrolledStudents.push({
        studentId: enrollment.user._id,
        studentName: enrollment.user.name,
        studentEmail: enrollment.user.email,
        enrollmentDate: enrollment.createdAt,
      });
      coursesWithEnrollments[courseId].enrollmentCount += 1;
    });

    // Convert object to array for response
    const response = Object.values(coursesWithEnrollments);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching instructor enrollments:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments.', error: error.message });
  }
};