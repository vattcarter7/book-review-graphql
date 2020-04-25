import { groupBy, map } from 'ramda';
import DataLoader from 'dataloader';
import query from '../db';

export const findAuthorsByBookIds = async (ids) => {
  const sql = `
    select 
    br.author.*,
    br.book_author.book_id
    from br.author inner join br.book_author
      on br.author.id = br.book_author.author_id
    where br.book_author.book_id = ANY($1);
  `;

  const params = [ids];
  
  try {
    const result = await query(sql, params);
    const rowsById = groupBy((author) => author.bookId, result.rows);
    return map((id) => rowsById[id], ids);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const findAuthorsByBookIdsLoader = () => {
  return new DataLoader(findAuthorsByBookIds);
};
