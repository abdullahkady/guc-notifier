import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption';

const courseWorkSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    grade: { type: Number, required: true },
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

// Encrypt the user password before saving the document
userSchema.pre('findOneAndUpdate', async function (next) {
  const { password } = this.getUpdate();
  const hash = encrypt(password);

  // Override the cleartext password with the hashed one
  this.getUpdate().password = hash;
  return next();
});

// Retrieve the password in plain text format
userSchema.methods.getPlainTextPassword = async function () {
  return decrypt(this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
