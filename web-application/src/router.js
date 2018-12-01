import { Router } from 'express';
import { BAD_REQUEST } from 'http-status';
import controller from './controller';
import { testEmail } from './utils/index';

const validateBody = (req, res, next) => {
  const { username, password, email } = req.body;
  const errors = [];
  if (!username) {
    errors.push('username<string> is required');
  }
  if (!password) {
    errors.push('password<string> is required');
  }
  if (!email) {
    errors.push('email<string> is required');
  } else if (!testEmail(email)) {
    errors.push('email<string> must be a valid email format');
  }

  if (errors.length > 0) {
    return res.status(BAD_REQUEST).json({ errors });
  }
  return next();
};

const router = new Router();
router.post('/', validateBody, controller.subscribeUser);

export default router;
