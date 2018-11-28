import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { NOT_FOUND, BAD_REQUEST } from 'http-status';
import router from './router';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(helmet());

app.use('/', router);

// General error handler
app.use((err, req, res, next) => {
  // If the error has no values, put in default values
  err.status = err.status || BAD_REQUEST;
  err.message = err.message || 'Something went wrong';

  const response = { message: err.message };
  // Indicate the validation violation in case of validation error
  if (err.message === 'validation error') {
    response.errors = err.errors;
  }

  return res.status(err.status).json(response);
});

// Catch all invalid routes
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Endpoint not found !' });
});

export default app;
