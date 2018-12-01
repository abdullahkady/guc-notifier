import mongoose from 'mongoose';
import { UNAUTHORIZED } from 'http-status';
import { MONGO_URI, mongoConnectionOptions, CHECK_INTERVAL } from './config';
import User from './user';

const checkUsersGrades = async (user) => {
  try {
    // Get courses
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
