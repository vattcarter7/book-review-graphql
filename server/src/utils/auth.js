import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT = 12;

export const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('password must be at least 8 characters');
  }
  return bycrypt.hash(password, SALT);
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, 'myJwtSecret', { expiresIn: '30 days' });
};

export const getUserId = (request, requireAuth = true) => {
  const header = request.req.headers.authorization;
  if (header) {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, 'myJwtSecret');
    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error('Authentication required');
  }
  return null;
};
