import mongoose from 'mongoose';
import decrypt from './utils';

const courseWorkSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    grade: { type: Number, required: true },
    maximumGrade: { type: Number, required: true },
  },
  { _id: false },
);

const gradesSchema = new mongoose.Schema(
  {
    code: { type: String },
    coursework: { type: [courseWorkSchema] },
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
  latestGrades: { type: [gradesSchema] },
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
