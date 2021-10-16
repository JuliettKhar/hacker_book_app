const {Pool} = require('pg');
import humps from 'humps';

const pool = new Pool({
    host: 'localhost',
    database: 'hackerbook'
})

function logQuery(sql, params) {
    console.log('BEGIN-------------------------------------');
    console.log('SQL:', sql);
    console.log('PARAMS:', JSON.stringify(params));
    console.log('END---------------------------------------');
};

async function query(sql, params) {
    try {
        logQuery(sql, params)
        const res = await pool.query(sql, params);
        const rows = humps.camelizeKeys(res.rows);
        return {...res, rows}
    } catch (err) {
        console.log(err);
        await pool.end();
    }
}

export default query;