import query from './db';
import {groupBy, map} from 'ramda';
import DataLoader from 'dataloader';

export async function allBooks() {
    const sql = `
        select * from hb.book;
    `;

    try {
        const result = await query(sql);
        return result.rows;
    } catch (e) {
        console.log(e);
        throw e
    }
}

export function imageUrl(size, id) {
    const zoom = size === 'SMALL' ? 1 : 0;
    return `//books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api`
}

export async function findBookByIds(ids) {
    const sql = `
    select * from hb.book
    where hb.book.id = ANY($1);
    `;
    const params = [ids];

    try {
        const result = await query(sql, params);
        const rowsById = groupBy(book => book.id, result.rows);
        return map(id => {
            return rowsById[id] ? rowsById[id][0] : null;
        }, ids);

    } catch (e) {
        console.log(e);
        throw e
    }
}

export function findBooksByIdsLoader() {
    return new DataLoader(findBookByIds);
}