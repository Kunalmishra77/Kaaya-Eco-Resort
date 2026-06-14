import { Router } from 'express'
import pool from '../lib/db.js'

const router = Router()

// GET /api/gallery?category=
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query

    let sql    = 'SELECT id, url, publicId, category, caption, sortOrder FROM GalleryImage WHERE active = 1'
    const params = []

    if (category && category !== 'all') {
      sql += ' AND category = ?'
      params.push(category)
    }

    sql += ' ORDER BY sortOrder ASC, createdAt DESC'

    const [rows] = await pool.execute(sql, params)
    res.json({ images: rows })
  } catch (err) {
    next(err)
  }
})

export default router
