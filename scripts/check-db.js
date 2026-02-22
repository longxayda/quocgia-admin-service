require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'heritage_user',
  password: process.env.DB_PASSWORD || 'heritage_pass_123',
  database: process.env.DB_NAME || 'heritage_db',
  connectionTimeoutMillis: 3000,
});
pool.query('SELECT 1 as ok')
  .then(() => { console.log('DB_OK'); process.exit(0); })
  .catch((err) => { console.log('DB_FAIL', err.message); process.exit(1); });
