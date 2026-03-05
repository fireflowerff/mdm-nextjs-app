// src/lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Welcome1',
  port: 5432,
});

export default pool;