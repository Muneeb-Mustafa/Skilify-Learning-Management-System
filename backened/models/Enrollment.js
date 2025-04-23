import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'cashapp'],
    default: 'card'
  },
  saveInformation: {
    type: Boolean,
    default: false
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  completedLectures: [{
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
    },
  }],
  // New fields for instructor dashboard
  courseTitle: { type: String, required: true },
  instructorName: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;