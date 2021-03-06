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
    console.log('ERRORRRRRR' + err);
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

export const createReview = async (reviewInput, reviewerId) => {
  const { bookId, rating, title, comment } = reviewInput;

  try {
    // Do the transaction
    await query('BEGIN');

    // 1. insert into review table
    const sql = `
      insert into br.review (user_id, book_id, rating, title, comment, tokens)
      values($1, $2, $3, $4, $5, to_tsvector($6)) returning *
    `;

    const params = [reviewerId, bookId, rating, title, comment, comment];

    const reviewResponse = await query(sql, params);

    // 2. update book table
    const updateBookSql = `
      update br.book set 
        rating_total = rating_total + $1,
        rating_count = rating_count + 1,
        rating = (rating_total::decimal + $2) / (rating_count::decimal  + 1)
      where id = $3`;

    const updateBookParams = [rating, rating, bookId];

    await query(updateBookSql, updateBookParams);
    await query('COMMIT');
    return reviewResponse.rows[0];
  } catch (err) {
    await query('ROLLBACK');
    console.log(err);
    throw err;
  }
};
