import bycrypt from 'bcryptjs';

const SALT = 12;

export const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('password must be at least 8 characters');
  }
  return bycrypt.hash(password, SALT);
};
