import query from './db';
import { map } from 'ramda';

export async function search(term) {
    const books = await searchBooks(term);
    const users = await searchUser(term);
    const authors = await searchAuthors(term);
    const reviews = await searchReviews(term);
    return [...books, ...users, ...authors, ...reviews];
}

export async function searchBooks(term) {
  const sql = `
  select * from hb.book
  where tokens @@ to_tsquery($1);
  `;

  try {
      const params = [term];
      const res = await query(sql, params);
      return map(obj => ({...obj, __type: 'Book'}), res.rows);
  } catch (e) {
      console.log(e);
        throw e
  }
}

async function searchUser(term) {
  const sql = `
  select * from hb.user
  where tokens @@ to_tsquery($1);
  `;
  try {
    const params = [term];
    const result = await query(sql, params);
    return map(user => ({ ...user, __type: 'User' }), result.rows);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function searchAuthors(term) {
  const sql = `
  select * from hb.author
  where tokens @@ to_tsquery($1);
  `;
  try {
    const params = [term];
    const result = await query(sql, params);
    return map(author => ({ ...author, __type: 'Author' }), result.rows);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function searchReviews(term) {
  const sql = `
  select * from hb.review
  where tokens @@ to_tsquery($1);
  `;
  try {
    const params = [term];
    const result = await query(sql, params);
    return map(review => ({ ...review, __type: 'Review' }), result.rows);
  } catch (err) {
    console.log(err);
    throw err;
  }
}