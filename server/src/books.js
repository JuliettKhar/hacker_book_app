import query from './db';
import {groupBy, map, pathOr} from 'ramda';
import DataLoader from 'dataloader';
import axios from 'axios';
import stripTags from 'striptags';

const ORDER_BY = {
    RATING_DESC: 'rating desc',
    ID_DESC: 'id desc'
}
export async function allBooks(args) {
    const orderBy = ORDER_BY[args.orderBy]
    const sql = `
        select * from hb.book
        order by ${orderBy};
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

export async function searchBook(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    try {
        const res = await axios(url);
        const items = pathOr([], ['data', 'items'], res);
        return map(book => ({id: book.id, ...book.volumeInfo}), items);
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function createBook(googleBookId) {
    try {
        const book = await findBookByGoogleId(googleBookId);
        const {
            title = '',
            subtitle = '',
            description = '',
            authors = [],
            pageCount = 0,
        } = book;
            const sql = `
    select * from hb.create_book($1, $2, $3, $4, $5, $6);
    `;
                const params = [
      googleBookId,
      stripTags(title),
      stripTags(subtitle),
      stripTags(description),
      authors,
      pageCount,
    ];
                const res = await query(sql, params);
    return res.rows[0];
    } catch (e) {
        console.log(e);
        throw e
    }
}

async function findBookByGoogleId(googleBookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`;
    try {
        const res = await axios(url);
        const book = pathOr({}, ['data'], res);
        return { ...book, ...book.volumeInfo};
    } catch (e) {
        console.log(e);
        throw e
    }
}