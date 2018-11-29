import axios from 'axios';
import { CREATED, UNAUTHORIZED } from 'http-status';
import { GUC_GRAPHQL_URI } from './config';
import { generateGraphQL } from './utils';
import User from './models/user';

const getCourses = async (user, pass) => {
  const query = {
    query: generateGraphQL(user, pass),
  };

  try {
    const { data } = await axios.post(GUC_GRAPHQL_URI, query);
    const studentData = data.data.student;
    if (!studentData.isAuthorized) {
      throw new Error('Invalid credentials');
    }
    return studentData.courses;
  } catch (err) {
    throw err;
  }
};

const subscribeUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  let courses;
  try {
    courses = await getCourses(username, password);
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      err.status = UNAUTHORIZED;
    }
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
