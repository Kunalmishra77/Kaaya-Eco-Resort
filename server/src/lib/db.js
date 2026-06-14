import mysql from 'mysql2/promise'

const url = new URL(process.env.DATABASE_URL || 'mysql://root@localhost:3306/kaaya')

const pool = mysql.createPool({
  socketPath:         '/var/lib/mysql/mysql.sock',
  user:               decodeURIComponent(url.username),
  password:           decodeURIComponent(url.password),
  database:           url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit:    5,
  charset:            'utf8mb4',
  timezone:           '+00:00',
})

export default pool
