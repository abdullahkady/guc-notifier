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
  USERS_CHECK_INTERVAL_SECS = 10,
  POLLING_FREQUENCY_MINS = 20,
  SENDGRID_API_KEY,
} = process.env;

const mongoConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const applicationEmailAddress = 'dontreply@guc-notifier.com';

export {
  applicationEmailAddress,
  MONGO_URI,
  mongoConnectionOptions,
  ENCRYPTION_SECRET,
  COURSEWORK_URI,
  USERS_CHECK_INTERVAL_SECS,
  POLLING_FREQUENCY_MINS,
  SENDGRID_API_KEY,
};
