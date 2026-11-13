import 'dotenv/config';
import pg from 'pg';
export function createDatabase(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('Database configuration missing');
  const url = new URL(connectionString);
  // URL SSL options otherwise override the explicit TLS verification settings.
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert', 'ssl']) url.searchParams.delete(key);
  const pool = new pg.Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: true },
    enableChannelBinding: true, max: 5, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000, query_timeout: 10000 });
  pool.on('error', () => console.error('Database connection error'));
  return pool;
}
export async function initializeDatabase(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL, message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'received', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}
