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
              coursework: [],
            });
          }
          // Push the new grade to the appropriate course in the result array
          const courseEntryInResult = result.find(course => course.code === newCourse.code);
          courseEntryInResult.coursework.push({
            type: newCourse.code,
            coursework: newGrade,
          });
        }
      });
    }
  });
  return result;
};

const checkUsersGrades = async (user) => {
  try {
    const retrivedCoursework = await getCourses(user.username, await user.getPlainTextPassword());
    const newGrades = compareGrades(user.latestGrades, retrivedCoursework);

    if (newGrades.length > 0) {
      // TODO: Send an email
      console.log('New grades: ', newGrades);
    }

    user.nextCheckTimestamp = new Date(new Date().getTime() + 2 * 60000);
    user.latestGrades = retrivedCoursework;
    await user.save();
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
