import query from './db';
import {groupBy, map } from 'ramda';
import DataLoader from 'dataloader';

export async function allReviews() {
    const sql = `
    select * from hb.review;
    `;
    
    try {
        const result = await query(sql);
        return result.rows;
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function findReviewsByBookIds(ids) {
const sql = `
select * from hb.review
where book_id = ANY($1)
order by id;
`;
const params = [ids];

    try {
        const result = await query(sql, params);
        const rowsById = groupBy(review => review.bookId, result.rows);
        return map(id => rowsById[id], ids);
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function createReview(reviewInput) {
const { bookId, email, name, rating, title, comment } = reviewInput;
const sql = `
select * from hb.create_review($1, $2, $3, $4, $5, $6);
`;
 const params = [bookId, email, name, rating, title, comment]
    try {
        const res = await query(sql, params);
        return res.rows[0];
    } catch (e) {
          console.log(e);
          throw e;
    }
}

export function findReviewsByBookIdsLoader() {
   return new DataLoader(findReviewsByBookIds)
}