import { map, groupBy } from 'ramda';
import DataLoader from 'dataloader';
import query from '../db';
import { hashPassword } from './auth';

const findUsersByIds = async (ids) => {
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
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};
