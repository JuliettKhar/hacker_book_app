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

export function findReviewsByBookIdsLoader() {
   return new DataLoader(findReviewsByBookIds)
}