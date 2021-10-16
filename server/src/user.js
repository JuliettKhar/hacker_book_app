import query from './db';
import {groupBy, map} from 'ramda';
import DataLoader from 'dataloader';

export async function allUsers() {
    const sql = `
    select * from hb.user;
    `;

    try {
        const result = await query(sql);
        return result.rows;
    } catch (e) {
        console.log(e);
        throw e
    }
}


export async function findUsersByIds(ids) {
    const sql = `
    select * from hb.user
    where hb.user.id = ANY($1);
    `;
    const params = [ids];

    try {
        const result = await query(sql, params);
        const rowsById = groupBy(user => user.id, result.rows);
        return map(id => {
            return rowsById[id] ? rowsById[id][0] : null;
        }, ids);

    } catch (e) {
        console.log(e);
        throw e
    }
}

export function findUsersByIdsLoader() {
    return new DataLoader(findUsersByIds);
}