// lib/db.js
import { Pool } from 'pg';

// Pour éviter la création multiple de pools en développement
let pool;

if (process.env.NODE_ENV === 'production') {
  // En production, créer un pool unique
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // En développement, éviter la création multiple de pools
  if (!global.dbPool) {
    global.dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  pool = global.dbPool;
}

export default pool;