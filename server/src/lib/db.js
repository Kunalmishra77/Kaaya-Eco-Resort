import mysql from 'mysql2/promise'

// Use separate env vars to avoid URL-encoding issues with special chars in passwords
const pool = mysql.createPool({
  socketPath:         '/var/lib/mysql/mysql.sock',
  user:               process.env.DB_USER     || 'u828459619_kaaya',
  password:           process.env.DB_PASS     || '',
  database:           process.env.DB_NAME     || 'u828459619_kaaya',
  waitForConnections: true,
  connectionLimit:    5,
  charset:            'utf8mb4',
  timezone:           '+00:00',
})

export default pool
