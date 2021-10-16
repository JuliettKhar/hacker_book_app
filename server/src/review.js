import query from './db';

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