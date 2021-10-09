const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'hackerbook'
})

async function query(sql, params) {
  try {
    return pool.query(sql, params)
  } catch (err) {
    console.log(err);
    await pool.end();
  }
}

export default query;