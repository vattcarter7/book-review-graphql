import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT = 12;

export const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('password must be at least 8 characters');
  }
  return bycrypt.hash(password, SALT);
};

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, 'myJwtSecret', { expiresIn: '30 days' });
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

export const authorizeTo = (request, roles) => {
  const header = request.req.headers.authorization;
  if (header) {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, 'myJwtSecret');

    // join() func convert to string from the array
    const allowedRoles = roles.join();
    if (!allowedRoles.includes(decoded.role)) {
      throw new Error(
        `User role ${decoded.role} is not authorized to this operation`
      );
    }
    return {
      userId: decoded.userId,
      role: decoded.role
    };
  } else {
    throw new Error('not authorized to this operation');
  }
};
