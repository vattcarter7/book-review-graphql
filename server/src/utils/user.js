import { map, groupBy } from 'ramda';
import bcrypt from 'bcryptjs';
import DataLoader from 'dataloader';
import query from '../db';
import { hashPassword, generateToken } from './auth';

export const findUsersByIds = async (ids) => {
  const sql = `
    select * 
    from br.user
    where br.user.id = ANY($1);
  `;
  const params = [ids];
  try {
    const result = await query(sql, params);
    const rowsById = groupBy((user) => user.id, result.rows);
    return map((id) => {
      const user = rowsById[id] ? rowsById[id][0] : null;
      return user;
    }, ids);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const findUsersByIdsLoader = () => {
  return new DataLoader(findUsersByIds);
};

export const allUsers = async () => {
  const sql = `
    select * from br.user
  `;
  try {
    const result = await query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createUser = async (data) => {
  const { name, email } = data;
  const password = await hashPassword(data.password);
  const sql = `
    insert into br.user (name, email, password) values($1, $2, $3) returning *
  `;
  const params = [name, email, password];
  try {
    const result = await query(sql, params);
    const user = result.rows[0];
    return {
      user,
      token: generateToken(user.id, user.userRole)
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const login = async (data) => {
  const { email, password } = data;
  const sql = `
    select * from br.user where email = $1;
  `;
  const params = [email];
  try {
    const result = await query(sql, params);
    if (!result.rows[0]) {
      throw new Error('unable to login');
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('unable to login');
    return {
      user,
      token: generateToken(user.id, user.userRole)
    };
  } catch (err) {
    console.log(err);
    throw new Error('unable to login');
  }
};

export const myProfile = async (userId) => {
  const sql = `
    select * from br.user where id = $1
  `;
  const params = [userId];

  try {
    const result = await query(sql, params);
    const user = result.rows[0];
    return user;
  } catch (err) {
    console.log(err);
    throw new Error('unable to get my profile');
  }
};
