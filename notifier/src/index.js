import mongoose from 'mongoose';
import axios from 'axios';
import { UNAUTHORIZED } from 'http-status';
import {
  MONGO_URI, mongoConnectionOptions, CHECK_INTERVAL, COURSEWORK_URI,
} from './config';
import User from './user';

const getCourses = async (username, password) => {
  try {
    const { data } = await axios.post(COURSEWORK_URI, { username, password });
    return data.courses;
  } catch ({ response }) {
    // Axios throws an error with the response object
    const { status } = response;
    const error = new Error();
    error.status = status;
    throw error;
  }
};

const checkUsersGrades = async (user) => {
  try {
    const retrivedCoursework = await getCourses(user.username, await user.getPlainTextPassword());
    // Compare grades and update database
  } catch (error) {
    if (error.status === UNAUTHORIZED) {
      // TODO: Remove the user from the database since his password expired
    }
  }
};

const handleReadyUsers = async () => {
  const users = await User.find({
    nextCheckTimestamp: {
      $lte: new Date(),
    },
  });

  users.forEach(checkUsersGrades);
};

const bootApplication = async () => {
  try {
    await mongoose.connect(
      MONGO_URI,
      mongoConnectionOptions,
    );

    handleReadyUsers();
    setInterval(handleReadyUsers, CHECK_INTERVAL);
    console.log('Started application successfully');
  } catch (error) {
    throw error;
  }
};

bootApplication();
