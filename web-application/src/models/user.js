import mongoose from 'mongoose';
import { encrypt } from '../utils';

const courseWorkGradeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    grade: { type: Number, required: true },
    maximumGrade: { type: Number, required: true },
  },
  { _id: false },
);

const courseWorkSchema = new mongoose.Schema(
  {
    code: { type: String },
    name: { type: String },
    coursework: { type: [courseWorkGradeSchema] },
  },
  { _id: false },
);

const transcriptCourseSchema = new mongoose.Schema(
  {
    course: {
      code: { type: String },
      name: { type: String },
    },
    grade: {
      german: { type: Number },
      american: { type: String },
    },
    creditHours: { type: Number },
  },
  { _id: false },
);

const transcriptSchema = new mongoose.Schema(
  {
    year: { type: String },
    type: { type: String },
    gpa: { type: Number },
    courses: [transcriptCourseSchema],
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: { type: String, required: true },
  email: { type: String },
  latestGrades: {
    coursework: {
      type: [courseWorkSchema],
    },
    transcript: {
      default: null,
      // Only store the latest entry (semester)
      type: transcriptSchema,
    },
  },
  nextCheckTimestamp: { type: Date, index: true },
  createdAt: { type: Date, default: new Date() },
});

/* eslint-disable func-names */

// Encrypt the user password before saving the document
userSchema.pre('findOneAndUpdate', async function (next) {
  const { password } = this.getUpdate();
  const hash = encrypt(password);

  // Override the cleartext password with the hashed one
  this.getUpdate().password = hash;
  return next();
});

const User = mongoose.model('User', userSchema);

export default User;
