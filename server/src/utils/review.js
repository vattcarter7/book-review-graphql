import { groupBy, map } from 'ramda';
import DataLoader from 'dataloader';
import query from '../db';

const ORDER_BY = {
  ID: 'id',
  ID_DESC: 'id desc'
};

export const findReviewsByBookIds = async (ids) => {
  const sql = `
    select * 
    from br.review
    where book_id = ANY($1)
    order by id;
  `;
  const params = [ids];
  try {
    const result = await query(sql, params);
    const rowsById = groupBy((review) => review.bookId, result.rows);
    return map((id) => rowsById[id], ids);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const findReviewsByBookIdsLoader = () => {
  return new DataLoader(findReviewsByBookIds);
};

/**
 * START of Test for findReviewsByUserIds
 */
export const findReviewsByUserIds = async (ids) => {
  const sql = `
    select * 
    from br.review
    where user_id = ANY($1)
  `;
  const params = [ids];
  try {
    const result = await query(sql, params);
    const rowsById = groupBy((review) => review.userId, result.rows);
    //console.log("ROW BY ID", rowsById)
    //console.log('MAP', map((id) => rowsById[id], ids))
    return map((id) => rowsById[id], ids);
  } catch (err) {
    console.log("ERRORRRRRR" + err);
    throw err;
  }
};

export const findReviewsByUserIdsLoader = () => {
  return new DataLoader(findReviewsByUserIds);
};

/**
 * END of Test for findReviewsByUserIds
 */

export const allReviews = async (args) => {
  const orderBy = ORDER_BY[args.orderBy];
  const sql = `
    select * from br.review
    order by ${orderBy};
  `;
  try {
    const result = await query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// TODO: createReview does not work for the moment. Check the database schema
export const createReview = async (reviewInput) => {
  const { bookId, email, name, rating, title, comment } = reviewInput;
  const sql = `
    select * from br.create_review($1, $2, $3, $4, $5, $6);
  `;
  const params = [bookId, email, name, rating, title, comment];
  try {
    const result = await query(sql, params);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};
