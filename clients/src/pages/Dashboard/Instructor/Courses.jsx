import React, { useEffect, useState } from 'react';
import { Table, Space, message, Modal, Button, Form, Input, Select, InputNumber, Upload, Spin } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses/get-courses`, { withCredentials: true });
      setCourses(Array.isArray(data) ? data : []);
      const uniqueCategories = [...new Set(data.map(course => course.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      message.error('Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      curriculum: course.curriculum || '',
      outcomes: course.outcomes || '',
      category: course.category,
      level: course.level,
      price: course.price,
      thumbnail: course.thumbnail ? [{ uid: '-1', name: 'thumbnail.jpg', status: 'done', url: course.thumbnail }] : [],
      video: course.video ? [{ uid: '-2', name: 'video.mp4', status: 'done', url: course.video }] : [],
      chapters: course.chapters || [],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async (values) => {
    setSpinner(true);
    try {
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('subtitle', values.subtitle || '');
      formData.append('description', values.description || '');
      formData.append('curriculum', values.curriculum || '');
      formData.append('outcomes', values.outcomes || '');
      formData.append('category', values.category);
      formData.append('level', values.level || '');
      formData.append('price', values.price);

      if (values.thumbnail && values.thumbnail.length > 0 && values.thumbnail[0].originFileObj) {
        formData.append('thumbnail', values.thumbnail[0].originFileObj);
      }

      if (values.video && values.video.length > 0 && values.video[0].originFileObj) {
        formData.append('video', values.video[0].originFileObj);
      }

      const chaptersArray = Array.isArray(values.chapters) ? values.chapters : [];
      formData.append('chapters', JSON.stringify(chaptersArray));

      const response = await axios.put(
        `${API_URL}/api/courses/update-course/${editingCourse._id}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      message.success('Course updated successfully');
      fetchCourses();
      setIsEditModalOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update course';
      message.error(errorMsg);
    } finally {
      setSpinner(false);
    }
  };

  const handleDelete = async (courseId) => {
    setDeleteSpinner(true);
    try {
      await axios.delete(`${API_URL}/api/courses/delete-course/${courseId}`, { withCredentials: true });
      message.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      message.error('Failed to delete course');
    } finally {
      setDeleteSpinner(false);
    }
  };

  const handleWatchVideo = (video) => {
    setVideoUrl(video);
    setIsVideoModalOpen(true);
  };

  // Chapter and Lecture Management in Modal
  const ChapterFormItems = () => {
    return (
      <Form.List name="chapters">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: '16px', padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  label="Chapter Title"
                  rules={[{ required: true, message: 'Please enter chapter title' }]}
                >
                  <Input placeholder="Chapter Title" />
                </Form.Item>
                <Form.List name={[name, 'lectures']}>
                  {(lectureFields, { add: addLecture, remove: removeLecture }) => (
                    <>
                      {lectureFields.map(({ key: lectureKey, name: lectureName, ...lectureRestField }) => (
                        <Space key={lectureKey} direction="vertical" style={{ width: '100%', marginBottom: '8px' }}>
                          <Form.Item
                            {...lectureRestField}
                            name={[lectureName, 'title']}
                            label="Lecture Title"
                            rules={[{ required: true, message: 'Please enter lecture title' }]}
                          >
                            <Input placeholder="Lecture Title" />
                          </Form.Item>
                          <Form.Item
                            {...lectureRestField}
                            name={[lectureName, 'duration']}
                            label="Duration (minutes)"
                            rules={[{ required: true, message: 'Please enter duration' }]}
                          >
                            <InputNumber min={0} style={{ width: '100%' }} />
                          </Form.Item>
                          <Form.Item
                            {...lectureRestField}
                            name={[lectureName, 'url']}
                            label="Lecture URL"
                            rules={[{ required: true, message: 'Please enter URL' }]}
                          >
                            <Input placeholder="Lecture URL" />
                          </Form.Item>
                          <Form.Item
                            {...lectureRestField}
                            name={[lectureName, 'isPreview']}
                            label="Preview Available"
                            valuePropName="checked"
                          >
                            <Input type="checkbox" />
                          </Form.Item>
                          <Button type="dashed" onClick={() => removeLecture(lectureName)} block>
                            Remove Lecture
                          </Button>
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => addLecture()} block>
                        Add Lecture
                      </Button>
                    </>
                  )}
                </Form.List>
                <Button type="dashed" onClick={() => remove(name)} block style={{ marginTop: '8px' }}>
                  Remove Chapter
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              Add Chapter
            </Button>
          </>
        )}
      </Form.List>
    );
  };

  // Responsive table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      ellipsis: true,
    }, 
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (text) => (text.length > 50 ? `${text.substring(0, 50)}...` : text),
      responsive: ['lg'], // Hide on medium and smaller screens
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      responsive: ['md'], // Hide on small screens
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      responsive: ['md'], // Hide on small screens
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `$${price}`,
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail) => thumbnail ? <img src={thumbnail} alt="thumbnail" width={50} /> : 'No Image',
      responsive: ['lg'], // Hide on medium and smaller screens
    },
    {
      title: 'Video',
      dataIndex: 'video',
      key: 'video',
      width: 100,
      render: (video) => video ? <Button type="link" onClick={() => handleWatchVideo(video)}>Watch</Button> : 'No Video',
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button style={{ backgroundColor: '#001529', color: '#fff' }} type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            style={{ backgroundColor: '#ff4d4f', color: '#fff' }}
            type="danger"
            onClick={() => handleDelete(record._id)}
            loading={deleteSpinner}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 'max-content' }} // Enable horizontal scrolling on small screens
        pagination={{ responsive: true }} // Responsive pagination
      />

      {/* Video Modal */}
      <Modal
        title="Course Video"
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '800px' }} // Responsive width
        bodyStyle={{ padding: '16px' }}
      >
        {videoUrl ? (
          <video controls style={{ width: '100%', maxHeight: '70vh' }}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No video available</p>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        okText={spinner ? <Spin /> : 'Update'}
        confirmLoading={spinner}
        okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
        width="90%"
        style={{ maxWidth: '800px' }} // Responsive width
        bodyStyle={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }} // Scrollable content on small screens
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateCourse}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter course title' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="subtitle" label="Subtitle">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="curriculum" label="Curriculum">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="outcomes" label="Outcomes">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="level" label="Level">
            <Select>
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="video"
            label="Video"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              beforeUpload={() => false}
              listType="text"
              accept="video/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>

          <div style={{ marginTop: '24px' }}>
            <h3>Chapters</h3>
            <ChapterFormItems />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Courses;