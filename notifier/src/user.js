import mongoose from 'mongoose';
import decrypt from './utils';

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
      // Only store the latest entry (semster)
      type: transcriptSchema,
    },
  },
  nextCheckTimestamp: { type: Date, index: true },
  createdAt: { type: Date, default: new Date() },
});

/* eslint-disable func-names */

// Retrieve the password in plain text format
userSchema.methods.getPlainTextPassword = async function () {
  return decrypt(this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
