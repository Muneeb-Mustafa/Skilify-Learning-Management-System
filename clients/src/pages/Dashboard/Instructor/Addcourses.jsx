import React, { useState } from "react";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";
import { Spin, Modal, Progress } from "antd";

const AddCourse = ({ initialData, isEditMode = false, courseId }) => {
  const [courseData, setCourseData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    curriculum: initialData?.curriculum || "",
    outcomes: initialData?.outcomes || "",
    category: initialData?.category || "",
    level: initialData?.level || "",
    price: initialData?.price || "",
    thumbnail: initialData?.thumbnail || null,
    video: initialData?.video || null,
    chapters: initialData?.chapters || [],
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for progress
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newLecture, setNewLecture] = useState({
    title: "",
    duration: 0,
    url: "",
    isPreview: false,
  });
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [isChapterModalVisible, setIsChapterModalVisible] = useState(false);
  const [isLectureModalVisible, setIsLectureModalVisible] = useState(false);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.files[0] });
  };

  const handleEditorChange = (field) => (value) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) {
      toast.error("Chapter title is required.");
      return;
    }

    const newChapter = {
      title: newChapterTitle,
      lectures: [],
    };

    setCourseData({
      ...courseData,
      chapters: [...courseData.chapters, newChapter],
    });
    setNewChapterTitle("");
    setIsChapterModalVisible(false);
  };

  const handleAddLecture = () => {
    if (!newLecture.title.trim() || !newLecture.duration || !newLecture.url) {
      toast.error("Lecture title, duration, and URL are required.");
      return;
    }

    const updatedChapters = [...courseData.chapters];
    updatedChapters[selectedChapterIndex].lectures.push(newLecture);

    setCourseData({
      ...courseData,
      chapters: updatedChapters,
    });
    setNewLecture({ title: "", duration: 0, url: "", isPreview: false });
    setIsLectureModalVisible(false);
    setSelectedChapterIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0); // Reset progress at the start

    const formData = new FormData();
    for (const key in courseData) {
      if (key === "chapters") {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }

    try {
      const url = isEditMode 
        ? `${API_URL}/api/courses/update-course/${courseId}`
        : `${API_URL}/api/courses/create-course`;
      
      const method = isEditMode ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // Update progress
        },
      });
      
      toast.success(isEditMode ? "Course updated successfully!" : "Course added successfully!");
      
      if (!isEditMode) {
        setCourseData({
          title: "",
          subtitle: "",
          description: "",
          curriculum: "",
          outcomes: "",
          category: "",
          level: "",
          price: "",
          thumbnail: null,
          video: null,
          chapters: [],
        });
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} course:`, error.response?.data);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} course. Please try again.`);
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress after completion
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Course" : "Basic Information"}
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block">Title</label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={courseData.subtitle}
              onChange={handleChange}
              className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block pb-2">Description</label>
            <MDEditor
              value={courseData.description}
              onChange={handleEditorChange("description")}
              className="text-black"
              preview="edit"
              style={{ backgroundColor: "white", color: "black" }}
              height={200}
            />
          </div>

          <div className="mb-4">
            <label className="block pb-2">Curriculum</label>
            <MDEditor
              value={courseData.curriculum}
              onChange={handleEditorChange("curriculum")}
              className="text-black"
              preview="edit"
              style={{ backgroundColor: "white", color: "black" }}
              height={200}
            />
          </div>

          <div className="mb-4">
            <label className="block pb-2">Outcomes</label>
            <MDEditor
              value={courseData.outcomes}
              onChange={handleEditorChange("outcomes")}
              className="text-black"
              preview="edit"
              style={{ backgroundColor: "white", color: "black" }}
              height={200}
            />
          </div>

          <div className="mb-4">
            <label className="block">Category</label>
            <select
              name="category"
              value={courseData.category}
              onChange={handleChange}
              className="w-100 p-2 rounded bg-blue-800 border border-gray-600"
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Next JS">Next JS</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Mern Stack Development">Mern Stack Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Javascript">Javascript</option>
              <option value="Python">Python</option>
              <option value="Docker">Docker</option>
              <option value="MongoDB">MongoDB</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Course Level</label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="w-100 p-2 rounded bg-blue-800 border border-gray-600"
            >
              <option value="">Select a level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Price ($)</label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="w-100 p-2 rounded bg-blue-800 border border-gray-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Course Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={handleFileChange}
              className="w-100 p-2 rounded bg-blue-800 border border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block">Upload Video</label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className="w-100 p-2 rounded bg-blue-800 border border-gray-600"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Chapters</h3>
            {courseData.chapters.map((chapter, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                <h4 className="font-semibold">{chapter.title}</h4>
                <ul className="list-disc pl-5">
                  {chapter.lectures.map((lecture, lectureIndex) => (
                    <li key={lectureIndex}>
                      {lecture.title} - {lecture.duration} mins (Preview: {lecture.isPreview ? "Yes" : "No"})
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChapterIndex(index);
                    setIsLectureModalVisible(true);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 rounded"
                >
                  Add Lecture
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsChapterModalVisible(true)}
              className="mb-4 w-100 px-4 py-2 bg-blue-600 rounded"
            >
              + Add Chapter
            </button>
          </div>

          <div className="flex justify-between mb-4">
            <button
              type="button"
              className="px-4 mx-2 py-2 bg-blue-600 rounded"
              onClick={() => setCourseData({
                title: "",
                subtitle: "",
                description: "",
                curriculum: "",
                outcomes: "",
                category: "",
                level: "",
                price: "",
                thumbnail: null,
                video: null,
                chapters: [],
              })}
            >
              {isEditMode ? "Reset Changes" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded flex items-center justify-center"
              style={{ backgroundColor: "#1C1E53" }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Spin size="small" className="mr-2" />
                  <Progress percent={uploadProgress} size="small" style={{ width: "100px" }} />
                </div>
              ) : (
                isEditMode ? "Update Course" : "Create Course"
              )}
            </button>
          </div>
        </form>

        <Modal
          title="Add New Chapter"
          visible={isChapterModalVisible}
          onOk={handleAddChapter}
          onCancel={() => {
            setIsChapterModalVisible(false);
            setNewChapterTitle("");
          }}
          okText="Add Chapter"
          cancelText="Cancel"
        >
          <input
            type="text"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            placeholder="Chapter Title"
            className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
          />
        </Modal>

        <Modal
          title="Add New Lecture"
          visible={isLectureModalVisible}
          onOk={handleAddLecture}
          onCancel={() => {
            setIsLectureModalVisible(false);
            setNewLecture({ title: "", duration: 0, url: "", isPreview: false });
            setSelectedChapterIndex(null);
          }}
          okText="Add Lecture"
          cancelText="Cancel"
        >
          <div className="mb-4">
            <label className="block">Lecture Title</label>
            <input
              type="text"
              value={newLecture.title}
              onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
              className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Duration (minutes)</label>
            <input
              type="number"
              value={newLecture.duration}
              onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })}
              className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Lecture URL</label>
            <input
              type="text"
              value={newLecture.url}
              onChange={(e) => setNewLecture({ ...newLecture, url: e.target.value })}
              className="w-100 p-2 rounded bg-gray-800 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Is Preview Free?</label>
            <input
              type="checkbox"
              checked={newLecture.isPreview}
              onChange={(e) => setNewLecture({ ...newLecture, isPreview: e.target.checked })}
              className="ml-2 ms-2 mt-1"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AddCourse;