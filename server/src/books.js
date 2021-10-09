import query from './db';
const books = [
    {
        id: 1,
        title: 'some title',
        description: 'desc',
        rating: 5,
        imageUrl: 'url.png'
    }
]

export async function allBooks() {
        const sql = `
        select * from hb.book;
    `;

    try {
        const result = await query(sql);
        return result.rows;
    } catch (e) {
        console.log(e);
        throw err
    }
    // return books;
}