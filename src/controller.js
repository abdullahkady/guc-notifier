import axios from 'axios';
import { CREATED, UNAUTHORIZED } from 'http-status';
import { COURSEWORK_URI } from './config';
import User from './models/user';

const getCourses = async (username, password) => {
  const { status, data } = await axios.post(COURSEWORK_URI, { username, password });
  if (status === UNAUTHORIZED) {
    const err = new Error('Invalid credentials');
    err.status = UNAUTHORIZED;
    throw err;
  }
  return data.courses;
};

const subscribeUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  let courses;
  try {
    courses = await getCourses(username, password);
  } catch (err) {
    return next(err);
  }

  const userDocument = {
    username,
    password,
    email,
    latestGrades: courses,
    nextCheckTimestamp: new Date(),
  };

  try {
    await User.findOneAndUpdate({ username }, userDocument, { upsert: true });
    return res.status(CREATED).json({ message: 'Subscribed successfully' });
  } catch (err) {
    return next(err);
  }
};

export default {
  subscribeUser,
};
