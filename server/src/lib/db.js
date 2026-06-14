// MySQL connection pool — pure Node.js, no Rust binary
import mysql from 'mysql2/promise'

const url = new URL(process.env.DATABASE_URL || 'mysql://root@localhost:3306/kaaya')

const pool = mysql.createPool({
  host:               url.hostname,
  port:               Number(url.port) || 3306,
  user:               decodeURIComponent(url.username),
  password:           decodeURIComponent(url.password),
  database:           url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit:    5,
  charset:            'utf8mb4',
  timezone:           '+00:00',
})

export default pool
