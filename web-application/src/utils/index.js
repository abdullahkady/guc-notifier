import crypto from 'crypto';
import { ENCRYPTION_SECRET } from '../config';

const testEmail = (email) => {
  // eslint-disable-next-line
  const RE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return RE.test(String(email).toLowerCase());
};

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_SECRET);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export { encrypt, testEmail };
