import { map, groupBy, pathOr } from 'ramda';
import DataLoader from 'dataloader';
import axios from 'axios';
import stripTags from 'striptags';
import query from '../db';

export const searchBook = async (query) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}`;
  try {
    const result = await axios(url);
    const items = pathOr([], ['data', 'items'], result);
    const books = map((book) => ({ id: book.id, ...book.volumeInfo }), items);
    return books;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const findBooksByIds = async (ids) => {
  const sql = `
    select * 
    from br.book
    where br.book.id = ANY($1);
  `;
  const params = [ids];
  try {
    const result = await query(sql, params);
    const rowsById = groupBy((book) => book.id, result.rows);
    return map((id) => {
      const book = rowsById[id] ? rowsById[id][0] : null;
      return book;
    }, ids);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const findBooksByIdsLoader = () => {
  return new DataLoader(findBooksByIds);
};

export const findBookById = async (id) => {
  const sql = `
    select * 
    from br.book
    where br.book.id = $1;
  `;
  const params = [id];
  try {
    const result = await query(sql, params);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const ORDER_BY = {
  ID_DESC: 'id desc',
  RATING_DESC: 'rating desc'
};

export const allBooks = async (args) => {
  const orderBy = ORDER_BY[args.orderBy];
  const sql = `
    select * from br.book
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

export const googleImageUrl = (size, id) => {
  const zoom = size === 'SMALL' ? 1 : 0;
  return `//books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api`;
};

export const createBook = async (googleBookId) => {
  try {
    const book = await findBookByGoogleId(googleBookId);
    const {
      title = '',
      subtitle = '',
      description = '',
      authors = [],
      pageCount = 0
    } = book;
    const sql = `
    select * from br.create_book($1, $2, $3, $4, $5, $6);
    `;
    const params = [
      googleBookId,
      stripTags(title),
      stripTags(subtitle),
      stripTags(description),
      authors,
      pageCount
    ];
    const result = await query(sql, params);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const findBookByGoogleId = async (googleBookId) => {
  const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`;
  try {
    const result = await axios(url);
    const book = pathOr({}, ['data'], result);
    return { ...book, ...book.volumeInfo };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
