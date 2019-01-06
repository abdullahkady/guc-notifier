import mongoose from 'mongoose';
import axios from 'axios';
import { UNAUTHORIZED } from 'http-status';
import {
  MONGO_URI,
  mongoConnectionOptions,
  USERS_CHECK_INTERVAL_SECS,
  COURSEWORK_API_URI,
  POLLING_FREQUENCY_MINS,
} from './config';
import User from './user';
import { emailUnsubscriptionNotification, emailNewGrades } from './utils/mail';

const getCourses = async (username, password) => {
  try {
    const { data } = await axios.post(COURSEWORK_API_URI, { username, password });
    return data.courses;
  } catch ({ response }) {
    // Axios throws an error with the response object
    const { status } = response;
    const error = new Error();
    error.status = status;
    throw error;
  }
};

const compareGrades = (oldCourses, newCourses) => {
  const result = [];
  newCourses.forEach((newCourse) => {
    const matchingOldCourse = oldCourses.find(course => course.code === newCourse.code);
    if (!matchingOldCourse) {
      // Course not found, so all of it's grades should be returned
      result.push(newCourse);
    } else {
      // Loop through each grade of the retrieved course
      newCourse.coursework.forEach((newGrade) => {
        const isOld = matchingOldCourse.coursework.find(
          oldGrade => oldGrade.type === newGrade.type && oldGrade.grade === newGrade.grade,
        );
        if (!isOld) {
          if (!result.find(course => course.code === newCourse.code)) {
            // If it's the first NEW grade for this course, push the course entry in the result
            result.push({
              code: newCourse.code,
              name: newCourse.name,
              coursework: [],
            });
          }
          // Push the new grade to the appropriate course in the result array
          const courseEntryInResult = result.find(course => course.code === newCourse.code);
          courseEntryInResult.coursework.push(newGrade);
        }
      });
    }
  });
  return result;
};

const minutesFromNow = minutes => new Date(new Date().getTime() + minutes * 60000);

const checkUsersGrades = async (user) => {
  try {
    const retrivedCoursework = await getCourses(user.username, await user.getPlainTextPassword());
    const newGrades = compareGrades(user.latestGrades, retrivedCoursework);

    if (newGrades.length > 0) {
      await emailNewGrades(user.email, newGrades);
    }

    user.latestGrades = retrivedCoursework;
    await user.save();
  } catch (error) {
    if (error.status === UNAUTHORIZED) {
      const { email } = await User.findOneAndDelete({ username: user.username });
      await emailUnsubscriptionNotification(email);
    }
  }
};

const handleUser = async (user) => {
  user.nextCheckTimestamp = minutesFromNow(POLLING_FREQUENCY_MINS);
  await user.save();
  await checkUsersGrades(user);
};

const handleReadyUsers = async () => {
  const users = await User.find({
    nextCheckTimestamp: {
      $lte: new Date(),
    },
  });

  users.forEach(handleUser);
};

const bootApplication = async () => {
  try {
    await mongoose.connect(
      MONGO_URI,
      mongoConnectionOptions,
    );

    handleReadyUsers();
    setInterval(handleReadyUsers, USERS_CHECK_INTERVAL_SECS * 1000);
    console.log('Started application successfully');
  } catch (error) {
    throw error;
  }
};

bootApplication();
