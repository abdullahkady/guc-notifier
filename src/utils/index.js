import crypto from 'crypto';
import { ENCRYPTION_SECRET } from '../config';

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_SECRET);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export { encrypt }; // eslint-disable-line
