/*
  This module just initalizes the environment variables.
  To work with es6 module, check: https://github.com/motdotla/dotenv/issues/133#issuecomment-255298822
*/
import dotenv from 'dotenv';

dotenv.config();

const {
  MONGO_URI,
  COURSEWORK_URI,
  ENCRYPTION_SECRET,
  USERS_CHECK_INTERVAL_SECS,
  POLLING_FREQUENCY_MINS,
} = process.env;

const mongoConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export {
  MONGO_URI,
  mongoConnectionOptions,
  ENCRYPTION_SECRET,
  COURSEWORK_URI,
  USERS_CHECK_INTERVAL_SECS,
  POLLING_FREQUENCY_MINS,
};
