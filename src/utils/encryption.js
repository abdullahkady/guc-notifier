import crypto from 'crypto';
import { ENCRYPTION_SECRET } from '../config';

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_SECRET);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_SECRET);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

export { encrypt, decrypt };
